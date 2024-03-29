# Generated by Django 2.2.9 on 2020-09-28 21:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tola_management', '0012_auto_20200708_1124'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermanagementauditlog',
            name='system_generated_update',
            field=models.BooleanField(default=False),
        ),
        migrations.AddConstraint(
            model_name='usermanagementauditlog',
            constraint=models.CheckConstraint(check=models.Q(models.Q(('admin_user__isnull', True), ('system_generated_update', True)), ('system_generated_update', False), _connector='OR'), name='user_change_either_system_or_admin_generated'),
        ),
    ]
