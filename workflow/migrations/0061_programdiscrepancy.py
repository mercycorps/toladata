# Generated by Django 3.2.12 on 2022-05-27 17:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0060_auto_20220420_1225'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProgramDiscrepancy',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idaa_json', models.JSONField(default=dict)),
                ('discrepancies', models.JSONField(default=list)),
                ('create_date', models.DateTimeField(auto_now_add=True)),
                ('edit_date', models.DateTimeField(auto_now=True)),
                ('program', models.ManyToManyField(blank=True, to='workflow.Program')),
            ],
        ),
    ]