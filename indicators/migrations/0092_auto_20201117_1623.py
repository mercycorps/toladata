# Generated by Django 2.2.14 on 2020-11-18 00:23

from django.db import migrations
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0091_help_text_updates'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicator',
            name='information_use',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('donor_reporting', 'Donor and/or stakeholder reporting'), ('internal_program_management', 'Internal program management and learning'), ('participant_accountability', 'Participant accountability')], help_text='Select the primary uses of the indicator and its intended audience. This is the most important field in an indicator plan, because it explains the utility of the indicator. If an indicator has no clear informational purpose, then it should not be tracked or measured. By articulating who needs the indicator data, why and what they need it for, teams ensure that only useful indicators are included in the program.', max_length=70, null=True, verbose_name='Information use'),
        ),
        migrations.AlterField(
            model_name='indicator',
            name='quality_assurance',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('data_cleaning', 'Data cleaning and processing'), ('data_collection', 'Data collection training and piloting'), ('data_cross_checks', 'Data cross checks or triangulation'), ('dqas', 'Data quality audits (DQAs)'), ('data_spot_checks', 'Data spot checks'), ('digital_data_collection', 'Digital data collection tools'), ('participatory_data_analysis', 'Participatory data analysis validation'), ('peer_reviews', 'Peer reviews or reproducibility checks'), ('randomized_phone_calls', 'Randomized phone calls to respondents'), ('randomized_visits', 'Randomized visits to respondents'), ('regular_reviews', 'Regular indicator and data reviews'), ('shadow_audits', 'Shadow audits'), ('standardized_indicators', 'Standardized indicators'), ('sops', 'Standard operating procedures (SOPs)')], help_text='Select any quality assurance measures specific to this indicator.', max_length=234, null=True, verbose_name='Quality assurance measures'),
        ),
    ]