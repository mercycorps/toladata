from factory import DjangoModelFactory, lazy_attribute, RelatedFactory
from django.template.defaultfilters import slugify


class UserFactory(DjangoModelFactory):
    class Meta:
        model = 'auth.User'
        django_get_or_create = ('username', )

    first_name = 'Thom'
    last_name = 'Yorke'
    username = lazy_attribute(lambda o: slugify(o.first_name + '.' +
                                                o.last_name))
    email = lazy_attribute(lambda o: o.username + "@testenv.com")

    tola_user = RelatedFactory('factories.workflow_models.TolaUserFactory', 'user')


class Group(DjangoModelFactory):
    class Meta:
        model = 'auth.Group'
        django_get_or_create = ('name',)

    name = 'admin'


class Site(DjangoModelFactory):
    class Meta:
        model = 'sites.Site'
        django_get_or_create = ('name',)

    name = 'toladata.io'
    domain = 'toladata.io'
