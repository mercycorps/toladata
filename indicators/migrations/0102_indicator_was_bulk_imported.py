# Generated by Django 2.2.21 on 2021-08-02 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0101_mod_help_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='was_bulk_imported',
            field=models.BooleanField(default=False, verbose_name='Bulk Imported'),
        ),
    ]
