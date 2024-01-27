# Generated by Django 4.2.7 on 2023-12-18 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nrimd', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('CaTrajPDBPath', models.CharField(max_length=100, null=True)),
                ('AaTrajPDBPath', models.CharField(blank=True, max_length=100, null=True)),
                ('StrucPDBPath', models.CharField(blank=True, max_length=500, null=True)),
                ('CaTrajPDBSha1', models.CharField(max_length=100, null=True)),
                ('AaTrajPDBSha1', models.CharField(max_length=100, null=True)),
                ('StrucPDBSha1', models.CharField(blank=True, max_length=500, null=True)),
                ('Name', models.CharField(blank=True, default='job', max_length=50)),
                ('Email', models.EmailField(blank=True, max_length=50, null=True)),
                ('NumFrames', models.IntegerField(blank=True, default=0)),
                ('NumResidues', models.IntegerField(default=0)),
                ('JobID', models.CharField(blank=True, default='0000AAAAA', max_length=20)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('JobStatus', models.CharField(blank=True, default='Running', max_length=20)),
                ('IP', models.CharField(blank=True, default='127.0.0.1', max_length=15)),
                ('SampleStart', models.IntegerField(default=1)),
                ('SampleEnd', models.IntegerField(default=56)),
                ('TrainInterval', models.IntegerField(default=60)),
                ('ValidateInterval', models.IntegerField(default=80)),
                ('TestInterval', models.IntegerField(default=100)),
                ('TimeStepSize', models.IntegerField(default=50)),
                ('Seed', models.IntegerField(default=42)),
                ('Epochs', models.IntegerField(default=200)),
                ('Lr', models.FloatField(default=0.0005)),
                ('Encoder', models.CharField(default='mlp', max_length=10)),
                ('EncoderDropout', models.FloatField(default=0.0)),
                ('EncoderHidden', models.IntegerField(default=256)),
                ('Decoder', models.CharField(default='rnn', max_length=10)),
                ('DecoderDropout', models.FloatField(default=0.0)),
                ('DecoderHidden', models.IntegerField(default=256)),
                ('LrDecay', models.IntegerField(default=200)),
                ('Gamma', models.FloatField(default=0.5)),
                ('Var', models.FloatField(default=5e-05)),
                ('VisualThreshold', models.FloatField(default=0.6)),
                ('DistThreshold', models.IntegerField(default=12)),
                ('SourceNode', models.IntegerField(blank=True, null=True)),
                ('TargetNode', models.IntegerField(blank=True, null=True)),
                ('Domains', models.CharField(default='β-1_1_48,DL_49_54,DiL_55_60,ZL_61_82,β-2_83_121,EL_122_141,β-3_142_153', max_length=100)),
                ('Example', models.BooleanField(blank=True, default=True)),
                ('Sample', models.BooleanField(blank=True, default=False)),
                ('SampleStrategy', models.IntegerField(default=1, null=True)),
                ('Sample1Arg1', models.IntegerField(default=1, null=True)),
                ('Sample1Arg2', models.IntegerField(default=3, null=True)),
                ('Sample2Arg1', models.IntegerField(default=3, null=True)),
                ('SampleSerials', models.CharField(blank=True, default='_', max_length=1000)),
                ('SampledNumResidues', models.IntegerField(blank=True, default=0, null=True)),
                ('PRS', models.BooleanField(default=False)),
                ('PRSNumPertubations', models.IntegerField(default=50, null=True)),
                ('PRSHessianMethod', models.IntegerField(default=1, null=True)),
                ('PRSDistanceThreshold', models.FloatField(blank=True, default=10, null=True)),
                ('PRSCosineThreshold', models.FloatField(blank=True, default=0.5, null=True)),
                ('EHH', models.BooleanField(default=False)),
                ('EHHCovarianceMethod', models.IntegerField(blank=True, default=1, null=True)),
                ('EHHMaxIterations', models.IntegerField(blank=True, default=100, null=True)),
                ('EHHAlpha', models.FloatField(blank=True, default=0.01, null=True)),
                ('EHHkBT', models.FloatField(blank=True, default=0.592, null=True)),
                ('EHHThreshold', models.FloatField(blank=True, default=0.0001, null=True)),
                ('EHHDistanceCutoff', models.IntegerField(blank=True, default=5, null=True)),
                ('CNA', models.BooleanField(default=False)),
                ('CNAStepSize', models.IntegerField(blank=True, default=1, null=True)),
            ],
        ),
    ]