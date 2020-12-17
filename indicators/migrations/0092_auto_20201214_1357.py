# Generated by Django 2.2.14 on 2020-12-14 21:57

from django.db import migrations, models
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0091_merge_20201123_1610'),
    ]

    operations = [
        migrations.AddField(
            model_name='indicator',
            name='quality_assurance_techniques',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('data_cleaning', 'Data cleaning and processing'), ('data_collection', 'Data collection training and piloting'), ('data_cross_checks', 'Data cross checks or triangulation'), ('dqas', 'Data quality audits (DQAs)'), ('data_spot_checks', 'Data spot checks'), ('digital_data_collection', 'Digital data collection tools'), ('participatory_data_analysis', 'Participatory data analysis validation'), ('peer_reviews', 'Peer reviews or reproducibility checks'), ('randomized_phone_calls', 'Randomized phone calls to respondents'), ('randomized_visits', 'Randomized visits to respondents'), ('regular_reviews', 'Regular indicator and data reviews'), ('shadow_audits', 'Shadow audits'), ('standardized_indicators', 'Standardized indicators'), ('sops', 'Standard operating procedures (SOPs)')], help_text='Select the data quality assurance techniques that will be applied to this specific indicator.', max_length=234, null=True, verbose_name='Data quality assurance techniques'),
        ),
        migrations.AlterField(
            model_name='indicator',
            name='quality_assurance',
            field=models.TextField(blank=True, help_text='Provide any additional details about how data quality will be ensured for this specific indicator. Additional details may include specific roles and responsibilities of team members for ensuring data quality and/or specific data sources to be verified, reviewed, or triangulated, for example.', max_length=500, null=True, verbose_name='Data quality assurance details'),
        ),
    ]
