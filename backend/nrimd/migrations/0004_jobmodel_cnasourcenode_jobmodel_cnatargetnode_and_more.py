# Generated by Django 4.2.8 on 2024-01-13 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nrimd', '0003_delete_aatrajectorypdbmodel_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobmodel',
            name='CNASourceNode',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='jobmodel',
            name='CNATargetNode',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='jobmodel',
            name='DomainVisualThreshold',
            field=models.FloatField(default=0.6),
        ),
        migrations.AddField(
            model_name='jobmodel',
            name='EHHSourceNode',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='jobmodel',
            name='EHHTargetNode',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='jobmodel',
            name='PRSSourceNode',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='jobmodel',
            name='PRSTargetNode',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='jobmodel',
            name='PathDistThreshold',
            field=models.IntegerField(default=12),
        ),
    ]
