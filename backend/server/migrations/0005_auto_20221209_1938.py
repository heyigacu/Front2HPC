# Generated by Django 2.2.13 on 2022-12-09 19:38

from django.db import migrations, models
import server.models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0004_auto_20221209_1930'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobmodel',
            name='JobId',
            field=models.CharField(default=server.models.unique_job_id, max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='jobmodel',
            name='StrucFilePath',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]