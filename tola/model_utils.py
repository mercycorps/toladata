# Consolidating our magic queryset and serializer compositional functions here
# Disable checking for protected methods and non-decorator classmethods because the magic/Django requires it:
# pylint: disable=W0212, R0202

"""Functions which generate querysets and serializers compositionally (using partials and mixins)

To reduce repetition (filtering out soft-deleted items, marking a program as rf-migrated, etc) these functions
allow small, specific mixins to be composed into a model Manager or queryset Serializer which combines all of their
logic to produce a filtered/annotated/ordered model queryset or serialized model queryset according to the specific
needs of one part of the site.
"""


from rest_framework import serializers
from django.db import models


def generate_queryset(*queryset_mixins):
    """Returns a model manager composed of queryset mixins

    Args:
        *queryset_mixins: one or more queryset mixins which provide one or more attributes as follows:
            qs_name (str): the purpose of this mixin for the final queryset manager
            annotate_methods: list of strings that correspond to methods that add annotations to each item in the QS
            filter_methods: list of strings that correspond to methods that filter the QS automatically
            ordering_methods: list of strings that correspond to methods that reorder the final QS

    Returns:
        Manager: a model Manager whose get_queryset method will apply all filter/annotate/order methods of each mixin

    Example:
        class YourModelRemoveOldItemsMixin:
            qs_name = "WithoutOldItems"
            filter_methods = ["remove_old_items"]

            def remove_old_items(self):
                # logic here

        class YourModel(models.Model):
            objects = generate_queryset(YourModelRemoveOldItemsMixin, YourModelAddCountsMixin).as_manager()
    """

    class BaseTolaManager(models.Manager):
        """Extends base model Manager by automatically calling "apply"
        on the queryset returned from get_queryset
        """

        def get_queryset(self):
            return super(BaseTolaManager, self).get_queryset().apply()


    class BaseTolaQS(models.QuerySet):
        """Extends the base model Queryset with an apply method to automatically apply methods from the
        composed mixins comprising the manager, filtering, annotating, and ordering the queryset
        """

        def apply(self):
            """Returns a queryset filtered, annotated, and ordered according to the logic of the mixins
            composed into the manager class
            """

            qs = self
            for filter_method in getattr(self, 'combined_filter_methods', []):
                if hasattr(qs, filter_method):
                    qs = getattr(qs, filter_method)()
            for annotate_method in getattr(self, 'combined_annotate_methods', []):
                if hasattr(qs, annotate_method):
                    qs = getattr(qs, annotate_method)()
            for ordering_method in getattr(self, 'combined_ordering_methods', []):
                if hasattr(qs, ordering_method):
                    qs = getattr(qs, ordering_method)()
            return qs

        # Overriding to ensure that queryset.as_manager returns our extended BaseTolaManager including .apply
        def as_manager(cls):
            manager = BaseTolaManager.from_queryset(cls)()
            manager._built_with_as_manager = True
            return manager

        as_manager.queryset_only = True
        as_manager = classmethod(as_manager)


    filter_methods = [
        method for method_list in [getattr(qs_mixin, 'filter_methods', []) for qs_mixin in queryset_mixins]
        for method in method_list
        ]
    annotate_methods = [
        method for method_list in [getattr(qs_mixin, 'annotate_methods', []) for qs_mixin in queryset_mixins]
        for method in method_list
        ]
    ordering_methods = [
        method for method_list in [getattr(qs_mixin, 'ordering_methods', []) for qs_mixin in queryset_mixins]
        for method in method_list
        ]

    queryset_name = str('_'.join([getattr(qs_mixin, 'qs_name', '') for qs_mixin in queryset_mixins] + ['QuerySet']))
    return type(
        queryset_name,
        tuple([BaseTolaQS] + list(queryset_mixins)),
        {
            'combined_filter_methods': filter_methods,
            'combined_annotate_methods': annotate_methods,
            'combined_ordering_methods': ordering_methods
        }
    )


def generate_safedelete_queryset(*queryset_mixins):
    """Shortcut function for generate_queryset(SafeDeleteMixin, *queryset_mixins).

    The arguments are the same as for generate_queryset.
    """

    class SafeDeleteMixin:
        qs_name = 'SafeDeleteAware'
        filter_methods = ['hide_deleted']

        def hide_deleted(self):
            """filters out soft-deleted items"""
            return self.filter(
                deleted__isnull=True
            )

    return generate_queryset(SafeDeleteMixin, *queryset_mixins)


def get_serializer(*serializer_classes):
    """Return a serializer class composed of one or more serializer mixins

    Args:
        *serializer_classes: one or more serializer mixins which contain the following attributes:
            *serializer_fields: one or more serializer fields
            Meta: class with the following attributes:
                purpose: (optional) purpose of this mixin (i.e. "RFAware")
                model (required for exactly one of the composed classes): a django model
                fields: list of fields corresponding to fields defined on the parent class or base model fields
                override_fields: boolean - ignore all other mixins' "fields" attributes
                    Note: override_fields applied to more than one mixin in the composition can lead to unexpected
                        behavior and probably indicates a different composition structure

    Returns:
        Serializer: a serializer with the fields composed from the provided mixins

    Example:
        class YourModelBaseMixin:
            class Meta:
                model = YourModel
                fields = ['pk', 'name']

        class YourModelExtensionMixin:
            new_field = serializers.CharField()
            new_field_extra = serializers.SerializerMethodField()
            class Meta:
                purpose = "ExtendWithNewField"
                fields = ['new_field']
            def get_new_field_extra(*args):
                # logic here

        YourModelExtendedSerializer = get_serializer(YourModelExtensionMixin, YourModelBaseMixin)

    The general approach for these serializers is to sequentially load serialized child data into context and
    to use that the values in context to power downstream serialization.  This last bit is mostly done through
    SerializerMethod fields. This approach avoids requerying data that has already been queried once by storing it
    in context for later use.
    """
    class_metas = [base_class for base_class in serializer_classes if hasattr(base_class, 'Meta')][::-1]
    overrides = [base_class for base_class in class_metas if getattr(base_class.Meta, 'override_fields', False)]
    if overrides:
        field_names = [field for base_class in overrides for field in getattr(base_class.Meta, 'fields', [])]
    else:
        field_names = [field for base_class in class_metas for field in getattr(base_class.Meta, 'fields', [])]
    related_serializers = {}
    fields = {}
    for base_class in class_metas:
        related_serializers.update(getattr(base_class.Meta, '_related_serializers', {}))
        for field in getattr(base_class.Meta, 'fields', []):
            if hasattr(base_class, field) and field in field_names:
                fields[field] = getattr(base_class, field)
    model = [
        getattr(base_class.Meta, 'model') for base_class in serializer_classes if (
            hasattr(base_class, 'Meta') and hasattr(base_class.Meta, 'model')
            )
        ][0]
    purpose = '|'.join([getattr(base_class.Meta, 'purpose', '') for base_class in class_metas]) or "Base"
    Meta = type('Meta', (object,), {'model': model, 'fields': field_names})
    klas = type(
        '{}|{}Serializer'.format(purpose, model.__name__),
        tuple(list(serializer_classes) + [serializers.ModelSerializer]),
        {'related_serializers': related_serializers,
         'Meta': Meta,
         **fields})
    return klas
