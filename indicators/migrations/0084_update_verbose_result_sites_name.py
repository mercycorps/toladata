# Generated by Django 2.2.5 on 2020-01-17 07:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0083_remove_extraneous_label'),
    ]

    operations = [
        migrations.AlterField(
            model_name='result',
            name='site',
            field=models.ManyToManyField(blank=True, help_text=' ', to='workflow.SiteProfile', verbose_name='Sites'),
        ),
    ]
