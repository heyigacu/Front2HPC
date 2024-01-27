from django.db import models

# Create your models here.


class JobModel(models.Model):
    """
    the class for the submitted jobs
    """
    # JOBSTATUS_CHOICES = (
    # (1, 'Running'),
    # (2, 'Finished'),
    # (3, 'Error'),
    # )
    
    CaTrajPDBPath = models.CharField(max_length=100,blank=False,null=True)
    AaTrajPDBPath = models.CharField(max_length=100,blank=True,null=True)
    StrucPDBPath = models.CharField(max_length=500,blank=True,null=True) 
    CaTrajPDBSha1 = models.CharField(max_length=100,blank=False,null=True)
    AaTrajPDBSha1 = models.CharField(max_length=100,blank=False,null=True)
    StrucPDBSha1 = models.CharField(max_length=500,blank=True,null=True) 

    SampledCaTrajPDBPath = models.CharField(max_length=100,blank=True,null=True)

    Name = models.CharField(max_length=50,blank=True,null=False, default="job")
    Email = models.EmailField(max_length=50,blank=True,null=True)
    NumFrames = models.IntegerField(blank=True,null=False,default=0)
    NumResidues = models.IntegerField(default=0,blank=False,null=False)

    JobID = models.CharField(blank=True,null=False,default="0000AAAAA", max_length=20)
    Created_at = models.DateTimeField(auto_now_add=True)
    JobStatus = models.CharField(default="Running",blank=True,null=False,max_length=20)
    IP = models.CharField(default='127.0.0.1',blank=True,max_length=15)

    SampleStart= models.IntegerField(default=1,blank=False,null=False)
    SampleEnd = models.IntegerField(default=56,blank=False,null=False) 
    TrainInterval = models.IntegerField(default=60,blank=False,null=False)
    ValidateInterval = models.IntegerField(default=80,blank=False,null=False)
    TestInterval = models.IntegerField(default=100,blank=False,null=False)
    TimeStepSize = models.IntegerField(default=50,blank=False,null=False)
    
    Seed = models.IntegerField(default=42,blank=False,null=False) 
    Epochs = models.IntegerField(default=200,blank=False,null=False)
    Lr = models.FloatField(default=0.0005,blank=False,null=False)
    Encoder = models.CharField(default='mlp',max_length=10,blank=False,null=False)
    EncoderDropout = models.FloatField(default=0.0,blank=False,null=False)
    EncoderHidden = models.IntegerField(default=256,blank=False,null=False)
    Decoder = models.CharField(default='rnn',max_length=10,blank=False,null=False)
    DecoderDropout = models.FloatField(default=0.0,blank=False,null=False)
    DecoderHidden = models.IntegerField(default=256,blank=False,null=False)
    LrDecay = models.IntegerField(default=200,blank=False,null=False)
    Gamma = models.FloatField(default=0.5,blank=False,null=False)
    Var = models.FloatField(default=0.00005,blank=False,null=False)

    VisualThreshold = models.FloatField(default=0.6,blank=False,null=False)
    DistThreshold = models.IntegerField(default=12,blank=False,null=False)
    SourceNode = models.IntegerField(blank=True,null=True)
    TargetNode = models.IntegerField(blank=True,null=True)
    PRSSourceNode = models.IntegerField(blank=True,null=True)
    PRSTargetNode = models.IntegerField(blank=True,null=True)
    EHHSourceNode = models.IntegerField(blank=True,null=True)
    EHHTargetNode = models.IntegerField(blank=True,null=True)
    CNASourceNode = models.IntegerField(blank=True,null=True)
    CNATargetNode = models.IntegerField(blank=True,null=True)
    DomainVisualThreshold = models.FloatField(default=0.6,blank=False,null=False)
    PathDistThreshold = models.IntegerField(default=12,blank=False,null=False)

    Domains = models.CharField(default=",",max_length=100)
    Example = models.BooleanField(blank=True,null=False,default=False)

    Sample = models.BooleanField(blank=True,null=False,default=False)
    SampleStrategy = models.IntegerField(blank=False,null=True,default=1)
    Sample1Arg1 = models.IntegerField(blank=False,null=True,default=1)
    Sample1Arg2 = models.IntegerField(blank=False,null=True,default=3)
    Sample2Arg1 = models.IntegerField(blank=False,null=True,default=3)
    SampleSerials = models.CharField(default='_',blank=True,max_length=1000)
    SampledNumResidues = models.IntegerField(default=0,blank=True,null=True)

    PRS = models.BooleanField(blank=False,null=False,default=False)
    PRSNumPertubations = models.IntegerField(blank=False,null=True,default=50) #ticks
    PRSHessianMethod = models.IntegerField(blank=False,null=True,default=1) #hessian
    PRSDistanceThreshold = models.FloatField(blank=True,null=True, default=10) #dist_threshold
    PRSCosineThreshold = models.FloatField(blank=True,null=True, default=0.5) #cosine_threshold
    EHH = models.BooleanField(blank=False,null=False,default=False)
    EHHCovarianceMethod = models.IntegerField(blank=True,null=True,default=1)
    EHHMaxIterations = models.IntegerField(blank=True,null=True, default=100)
    EHHAlpha = models.FloatField(blank=True,null=True, default=0.01)
    EHHkBT = models.FloatField(blank=True,null=True,default=0.592)
    EHHThreshold = models.FloatField(blank=True,null=True,default=0.0001)
    EHHDistanceCutoff = models.IntegerField(blank=True,null=True,default=5)
    CNA = models.BooleanField(blank=False,null=False,default=False)
    CNAStepSize = models.IntegerField(blank=True,null=True,default=1)



# class CaTrajectoryPDBModel(models.Model):
#     CaTrajectoryPDB = models.FileField(blank=False, null=True)

# class AaTrajectoryPDBModel(models.Model):
#     AaTrajectoryPDB = models.FileField(blank=True, null=True)

# class StructurePDBModel(models.Model):
#     StructurePDB = models.FileField(blank=True, null=True)

















