# Generated by Django 3.2.12 on 2022-08-11 19:39

from django.db import migrations


idaa_sectors = [
    "(Empty)", "Agriculture", "Cash, Goods and Voucher Assistance", "Employment",
    "Environment (DRR, Energy and Water)", "Financial Services", "Infrastructure (non-WASH, non-energy)"
]


def populate_idaa_sectors(apps, schema_editor):
    idaa_sector_model = apps.get_model('workflow', 'IDAASector')
    
    for idaa_sector in idaa_sectors:
        idaa_sector_model.objects.get_or_create(sector=idaa_sector)


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0062_auto_20220615_0936'),
    ]

    operations = [
        migrations.RunPython(populate_idaa_sectors)
    ]