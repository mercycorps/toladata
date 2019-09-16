"""Base classes and methods to generate querysets incorporating various logic repeated throughout Tola

- generate_queryset: takes a list of queryset mixins as an argument, returns a model manager that
    filters, annotates, and orders correctly when the queryset is called.

    Usage: in a model, objects = model_utils.generate_queryset(MixinA, MixinB)
        will result in model.objects.all() returning a queryset that is filtered, annotated, and ordered
        according to the logic in MixinA and MixinB

- SafeDeleteMixin: for any safe delete objects, filters out soft deleted objects from results

- generate_serializer: takes a list of serializer mixins, produces a composite serializer

"""

from django.db import models
from rest_framework import serializers


def generate_queryset(*queryset_mixins):
    """Takes a list of queryset mixins and returns a new queryset manager class

        new manager class will automatically filter, annotate, and order results when the queryset is
        evaluated
    """

    class BaseTolaManager(models.Manager):
        def get_queryset(self):
            return super(BaseTolaManager, self).get_queryset().apply()

    class BaseTolaQS(models.QuerySet):
        def apply(self):
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
    class SafeDeleteMixin(object):
        qs_name = 'SafeDeleteAware'
        filter_methods = ['hide_deleted']

        def hide_deleted(self):
            return self.filter(
                deleted__isnull=True
            )

    return generate_queryset(SafeDeleteMixin, *queryset_mixins)

def get_serializer(*serializer_classes):
    model = [
        getattr(base_class.Meta, 'model') for base_class in serializer_classes if (
            hasattr(base_class, 'Meta') and hasattr(base_class.Meta, 'model')
            )
        ][0]
    override_fields = [
        field for base_class in serializer_classes if getattr(base_class.Meta, 'override_fields', False)
        for field in getattr(base_class.Meta, 'fields', [])
        ]
    klas = type(
        'New{}Serializer'.format(model.__name__),
        tuple(list(serializer_classes) + [serializers.ModelSerializer]),
        {
            field: getattr(base_class, field) for base_class in serializer_classes
            for field in getattr(base_class.Meta, 'fields', []) if (
                hasattr(base_class, field) and (field in override_fields or not override_fields)
            )
        })
    klas.Meta.model = model
    klas.Meta.fields = [
        field for base_class in serializer_classes for field in getattr(base_class.Meta, 'fields', [])
        ] if not override_fields else override_fields
    return klas