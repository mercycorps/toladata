# Generated by Django 2.2.5 on 2019-11-07 21:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0077_add_ordering_to_disaggregation_labels'),
    ]

    operations = [
        migrations.AlterField(
            model_name='disaggregationlabel',
            name='label',
            field=models.CharField(max_length=765, verbose_name='Label'),
        ),
    ]
