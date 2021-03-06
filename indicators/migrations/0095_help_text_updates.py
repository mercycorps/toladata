# Generated by Django 2.2.14 on 2021-02-03 23:53

from django.db import migrations, models
import multiselectfield.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('indicators', '0094_unique_pinned_report_names'),
    ]

    operations = [
        migrations.AlterField(
            model_name='indicator',
            name='information_use',
            field=models.TextField(blank=True, help_text='Describe the primary uses of the indicator and its intended audience. This is the most important field in an indicator plan, because it explains the utility of the indicator. If an indicator has no clear informational purpose, then it should not be tracked or measured. By articulating who needs the indicator data, why and what they need it for, teams ensure that only useful indicators are included in the program.', max_length=500, null=True, verbose_name='Information use'),
        ),
        migrations.AlterField(
            model_name='indicator',
            name='quality_assurance_techniques',
            field=multiselectfield.db.fields.MultiSelectField(blank=True, choices=[('data_cleaning', 'Data cleaning and processing'), ('data_collection', 'Data collection training and piloting'), ('data_cross_checks', 'Data cross checks or triangulation of data sources'), ('dqas', 'Data quality audits (DQAs)'), ('data_spot_checks', 'Data spot checks'), ('digital_data_collection', 'Digital data collection tools'), ('external_evaluator', 'External evaluator or consultant'), ('mixed_methods', 'Mixed methods'), ('participatory_data_analysis', 'Participatory data analysis validation'), ('peer_reviews', 'Peer reviews or reproducibility checks'), ('randomized_phone_calls', 'Randomized phone calls to respondents'), ('randomized_visits', 'Randomized visits to respondents'), ('regular_reviews', 'Regular indicator and data reviews'), ('secure_data_storage', 'Secure data storage'), ('shadow_audits', 'Shadow audits or accompanied supervision'), ('standardized_indicators', 'Standardized indicators'), ('sops', 'Standard operating procedures (SOPs) or protocols')], help_text='Select the data quality assurance techniques that will be applied to this specific indicator.', max_length=287, null=True, verbose_name='Data quality assurance techniques'),
        ),
        migrations.AlterField(
            model_name='indicator',
            name='rationale_for_target',
            field=models.TextField(blank=True, help_text='Provide an explanation for any target value/s assigned to this indicator. You might include calculations and any historical or secondary data sources used to estimate targets.', max_length=500, null=True, verbose_name='Rationale for target'),
        ),
    ]
