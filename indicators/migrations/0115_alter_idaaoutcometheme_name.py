# Generated by Django 3.2.12 on 2022-10-06 20:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0114_verbose_names'),
    ]

    operations = [
        migrations.AlterField(
            model_name='idaaoutcometheme',
            name='name',
            field=models.CharField(max_length=255, unique=True, verbose_name='Outcome theme name'),
        ),
    ]