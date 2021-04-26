# Generated by Django 2.2.14 on 2021-03-22 14:29

from django.db import migrations
from django.db.models import Q


def copy_indicator_changes_field_to_comments(apps, schema_editor):
    Indicator = apps.get_model("indicators", "Indicator")
    db_alias = schema_editor.connection.alias
    filtered_indicators = Indicator.objects\
        .using(db_alias)\
        .exclude(Q(indicator_changes='') | Q(indicator_changes__isnull=True))

    for indicator in filtered_indicators:
        new_comments = f'Changes to indicator / Changements apportés à l’indicateur / Cambios en el indicador:  {indicator.indicator_changes}'
        if indicator.comments:
            new_comments = f'{indicator.comments}\n\n{new_comments}'
        indicator.comments = new_comments
        indicator.save()


def reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0096_reporting_and_data_collection_updates'),
    ]

    operations = [
        migrations.RunPython(copy_indicator_changes_field_to_comments, reverse),
        migrations.RemoveField(
            model_name='indicator',
            name='indicator_changes',
        ),
    ]