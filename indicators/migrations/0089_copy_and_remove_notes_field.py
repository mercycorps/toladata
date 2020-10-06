# Generated by Django 2.2.9 on 2020-10-06 21:07

from django.db import migrations

def copy_notes_field_to_comments(apps, schema_editor):
    Indicator = apps.get_model("indicators", "Indicator")
    db_alias = schema_editor.connection.alias
    notes_indicators = Indicator.objects.using(db_alias).filter(notes__isnull=False).exclude(notes='')
    for notes_indicator in notes_indicators:
        comments = notes_indicator.comments
        new_comments = ''
        if comments:
            new_comments = comments + "\n\nNotes:\n"
        new_comments += notes_indicator.notes
        notes_indicator.comments = new_comments
        notes_indicator.save()

def reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0088_auto_20201006_1356'),
    ]

    operations = [
        migrations.RunPython(copy_notes_field_to_comments, reverse),
        migrations.RemoveField(
            model_name='indicator',
            name='notes',
        ),
    ]
