# Generated by Django 2.2.13 on 2022-12-08 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobmodel',
            name='Email',
            field=models.EmailField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='jobmodel',
            name='Name',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
