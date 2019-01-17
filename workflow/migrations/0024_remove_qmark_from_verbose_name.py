# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-12-26 23:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0023_tolauser_activecountry'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicalprojectcomplete',
            name='capacity_built',
            field=models.TextField(blank=True, max_length=755, null=True, verbose_name='Describe how sustainability was ensured for this project'),
        ),
        migrations.AlterField(
            model_name='projectcomplete',
            name='capacity_built',
            field=models.TextField(blank=True, max_length=755, null=True, verbose_name='Describe how sustainability was ensured for this project'),
        ),
    ]
