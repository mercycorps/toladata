# Generated by Django 2.2.9 on 2020-07-08 18:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workflow', '0057_delete_loggeduser'),
    ]

    operations = [
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Region Name')),
                ('gait_region_id', models.PositiveIntegerField(blank=True, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='country',
            name='region',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='workflow.Region'),
        ),
    ]
