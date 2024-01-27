

from django.shortcuts import render

# Create your views here.
import time,os
import shutil
#response
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core import mail
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job
#ml
from .utils.trajectory import validate_ca_traj_pdb,validate_aa_traj_pdb
from .utils.stool import generate_jobid
from .utils.ca2aa import generate_pdb4pv_from_nri_catraj
from .algorithms.nri.sample import *
from .algorithms.nri.NRI import nri_preprocess_and_main, nri_cov, nri_path, nri_visual
from .hpc.BackJobsRunner import BackJobsRunner
from .algorithms.prs.PRS import prs_total
from .algorithms.ehh.EHH import ehh_total
from .algorithms.cna.CNA import cna_total
#view
from .models import JobModel
from .serializers import JobSerializer

EXAMPLE1_SHA1 = "19cf847c8f767fd078926e51cc6d297376e1da2d"
EXAMPLE1_ZIP_SHA1 = "19cf847c8f767fd078926e51cc6d297376e1da2d"
EXAMPLE2_SHA1 = "8b00caf1ce903d6311286687c25af668725b5cd4"
EXAMPLE2_ZIP_SHA1 = "8b00caf1ce903d6311286687c25af668725b5cd4"

from backend.settings import NRIMD_DATA_DIR, PV_PDB_DIR, WEBSITE, FROM_EMAIL, NRI_COMPUTE_LOCALHOST, OTHER_METHODS_COMPUTE_LOCALHOST, REMO_DIR, EMAIL_HOST_USER


from threading import Timer
class RepeatingTimer(Timer): 
    def run(self):
        while not self.finished.is_set():
            self.function(*self.args, **self.kwargs)
            self.finished.wait(self.interval)

def MyCheckStatusAndSendEmail():
    # print("start searching") 
    queryset=JobModel.objects.all()
    if not NRI_COMPUTE_LOCALHOST:
        try:
            for job in queryset:
                if job.JobID != None:
                    job_folder = os.path.join(NRIMD_DATA_DIR, 'jobs/'+ job.JobID)
                    if(os.path.exists(job_folder) and job.JobStatus!="Finished" and job.JobStatus!="Error"):
                        print("analysis:", job.JobID)
                        if not os.path.exists(job_folder+'/logs/out_probs_train.npy'):
                            return
                        try:
                            job.JobStatus=calculateAnalysisLocalHost(job)
                            if job.Email != None:
                                mail.send_mail(
                                    subject='NRIMD job {} finished'.format(job.Name),
                                    message='Your NRIMD job has finished, your result is availabe at {}/result/{}'.format(WEBSITE,job.JobID),
                                    from_email=FROM_EMAIL,
                                    recipient_list=[job.Email]
                                )
                        except: 
                            job.JobStatus="Error"
                        
                        job.save()
        except:
            pass

t = RepeatingTimer(10, MyCheckStatusAndSendEmail)
t.start()
scheduler = BackgroundScheduler()
scheduler.add_jobstore(DjangoJobStore(), 'default')
register_events(scheduler)
scheduler.start()   


def other_methods_localhost(
        job,
        PRS,
        CaTrajPDBPath,
        PRSNumPertubations,
        PRSHessianMethod,
        PRSDistanceThreshold,
        PRSCosineThreshold,
        EHH,
        EHHCovarianceMethod,
        EHHMaxIterations,
        EHHAlpha,
        EHHkBT,
        EHHThreshold,
        EHHDistanceCutoff,
        CNA,
        CNAStepSize,
        SourceNode,
        TargetNode,
        save_folder,
        JobID,
        AaTrajPDBPath
    ):
    if PRS == True:
        try:
            prs_total(
            traPDBpath = CaTrajPDBPath,
            dist_threshold = PRSDistanceThreshold,
            hessian = PRSHessianMethod,
            save_folder = save_folder,
            source_node = SourceNode,
            target_node = TargetNode,
            cosine_threshold = PRSCosineThreshold,
            n_ticks = PRSNumPertubations
            )
        except:
            job.PRSStatus = 'Error'
    if EHH == True:
        try:
            ehh_total(
                jobid=JobID,
                jobsdata_dir=NRIMD_DATA_DIR,
                trajPDB_path= CaTrajPDBPath,	
                N3cov=EHHCovarianceMethod,
                max_iterations=EHHMaxIterations,
                alpha=EHHAlpha,
                kBT=EHHkBT,
                threshold=EHHThreshold,
                distance_cutoff=EHHDistanceCutoff,
                source_node = SourceNode,
                target_node = TargetNode,
                )
        except:
            job.EHHStatus = 'Error'
    if CNA == True:
        try:
            cna_total(
                jobid=JobID,
                jobsdata_dir=NRIMD_DATA_DIR,
                aatrajPDB_path= AaTrajPDBPath,	
                interval=CNAStepSize,
                source_node=SourceNode,
                target_node=TargetNode,
            )
        except:
            job.CNAStatus = 'Error'
        job.save()

def nri_hpc(
    JobID='0000AAAAA',
    CatrajPDBName='0000AAAAA_77_3000.pdb',
    SampleStart=1,
    SampleEnd=56,
    TimeStepSize=50,
    TrainInterval=60,
    ValidateInterval=80,
    TestInterval=100,
    Seed=42,
    Epochs=500,
    Lr=0.0005,
    Encoder_hidden=256,
    Decoder_hidden=256,
    Encoder='mlp',
    Decoder='rnn',
    EncoderDropout=0.0,
    DecoderDropout=0.0,
    LrDecay=200,
    Gamma=0.5,
    Var=5e-5,
    DistThreshold=12,
    SourceNode=42,
    TargetNode=61,
    VisualThreshold=0.6,
    Domains='A_0_40,B_41_70,C_71_76',
    ):
    ## example of submit jobs from the front end, standard
    jobid = JobID
    filename = CatrajPDBName
    params={
        'start':SampleStart, # start from 1
        'end':SampleEnd,  # start from 1
        'timestep_size':TimeStepSize,
        'train_interval':TrainInterval,
        'validate_interval':ValidateInterval,
        'test_interval':TestInterval,
        'seed':Seed,
        'epochs':Epochs,
        'lr':Lr,
        'encoder_hidden':Encoder_hidden,
        'decoder_hidden':Decoder_hidden,
        'encoder':Encoder,
        'decoder':Decoder,
        'encoder_dropout':EncoderDropout,
        'decoder_dropout':DecoderDropout,
        'lr_decay':LrDecay,
        'gamma':Gamma,
        'var':Var,
        'dist_threshold':DistThreshold, # default is end-start+1
        'source_node':SourceNode, # start from 0
        'target_node':TargetNode, # start from 0
        'threshold':VisualThreshold,
        'domainInput':Domains, # default: ',', # start from 0
        }
    print(filename)
    bj = BackJobsRunner(jobid = jobid, filename = filename, params = params)
    print('Submit to HPC:')
    bj.submit()
    print('Submit to HPC finished.')

def calculateAllLocalHost(job):
    nri_preprocess_and_main(
        NRIMD_DATA_DIR= NRIMD_DATA_DIR,
        JobID=job.JobID,
        CatrajPDBPath=job.CaTrajPDBPath,
        NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
        SampleStart=job.SampleStart,
        SampleEnd=job.SampleEnd,
        TimeStepSize=job.TimeStepSize,
        TrainInterval=job.TrainInterval,
        ValidateInterval=job.ValidateInterval,
        TestInterval=job.TestInterval,
        Seed=job.Seed,
        Epochs=job.Epochs,
        Lr=job.Lr,
        Encoder_hidden=job.EncoderHidden,
        Decoder_hidden=job.DecoderHidden,
        Encoder=job.Encoder,
        Decoder=job.Decoder,
        EncoderDropout=job.EncoderDropout,
        DecoderDropout=job.DecoderDropout,
        LrDecay=job.LrDecay,
        Gamma=job.Gamma,
        Var=job.Var,
    )
    nri_cov(
        jobsdata_dir = NRIMD_DATA_DIR,
        CatrajPDBPath = job.SampledCaTrajPDBPath if job.Sample else job.CaTrajPDBPath,
        JobID = job.JobID,
        NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
        SampleStart=job.SampleStart,
        SampleEnd=job.SampleEnd,
        DistThreshold=job.DistThreshold,
        SampleSerials=job.SampleSerials,
    )
    nri_visual(
        jobsdata_dir = NRIMD_DATA_DIR,
        JobID = job.JobID,
        NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
        SampleStart=job.SampleStart,
        SampleEnd=job.SampleEnd,
        VisualThreshold=job.VisualThreshold,
        Domains=job.Domains,
        SampleSerials=job.SampleSerials,
    )
    nri_path(
        CatrajPDBPath = job.SampledCaTrajPDBPath if job.Sample else job.CaTrajPDBPath,
        jobsdata_dir=NRIMD_DATA_DIR,
        JobID=job.JobID,
        NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
        SampleStart=job.SampleStart,
        SampleEnd=job.SampleEnd,
        DistThreshold=job.DistThreshold,
        SourceNode=job.SourceNode,
        TargetNode=job.TargetNode,
        SampleSerials=job.SampleSerials
    )
    other_methods_localhost(
        job=job,
        PRS=job.PRS,
        CaTrajPDBPath=job.CaTrajPDBPath,
        PRSNumPertubations=job.PRSNumPertubations,
        PRSHessianMethod=job.PRSHessianMethod,
        PRSDistanceThreshold=job.PRSDistanceThreshold,
        PRSCosineThreshold=job.PRSCosineThreshold,
        EHH=job.EHH,
        EHHCovarianceMethod=job.EHHCovarianceMethod,
        EHHMaxIterations=job.EHHMaxIterations,
        EHHAlpha=job.EHHAlpha,
        EHHkBT=job.EHHkBT,
        EHHThreshold=job.EHHThreshold,
        EHHDistanceCutoff=job.EHHDistanceCutoff,
        CNA=job.CNA,
        CNAStepSize=job.CNAStepSize,
        SourceNode=job.SourceNode,
        TargetNode=job.TargetNode,
        save_folder=NRIMD_DATA_DIR+'/jobs/'+job.JobID+'/analysis/',
        JobID=job.JobID,
        AaTrajPDBPath=job.AaTrajPDBPath
        )
    if job.Email != None:
        mail.send_mail(
        subject='NRIMD job {} finished'.format(job.Name),
        message='Your NRIMD job has finished, your result is availabe at {}/result/{}'.format(WEBSITE,job.JobID),
        from_email=FROM_EMAIL,
        recipient_list=[job.Email]
        )
    job.JobStatus="Finished"
    job.save()

def calculateAnalysisLocalHost(job):
    try:
        nri_visual(
            jobsdata_dir = NRIMD_DATA_DIR,
            JobID = job.JobID,
            NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
            SampleStart=job.SampleStart,
            SampleEnd=job.SampleEnd,
            VisualThreshold=job.VisualThreshold,
            Domains=job.Domains,
            SampleSerials=job.SampleSerials,
        )
    except:
        pass
    try:
        nri_path(
            CatrajPDBPath=job.SampledCaTrajPDBPath if job.Sample else job.CaTrajPDBPath,
            jobsdata_dir=NRIMD_DATA_DIR,
            JobID=job.JobID,
            NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
            SampleStart=job.SampleStart,
            SampleEnd=job.SampleEnd,
            DistThreshold=job.DistThreshold,
            SourceNode=job.SourceNode,
            TargetNode=job.TargetNode,
            SampleSerials=job.SampleSerials
        )
    except:
        pass
    try:
        nri_cov(
            jobsdata_dir = NRIMD_DATA_DIR,
            CatrajPDBPath=job.SampledCaTrajPDBPath if job.Sample else job.CaTrajPDBPath,
            JobID = job.JobID,
            NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
            SampleStart=job.SampleStart,
            SampleEnd=job.SampleEnd,
            DistThreshold=job.DistThreshold,
            SampleSerials=job.SampleSerials,
        )
    except:
        return "Finished"
    try:
        other_methods_localhost(
            job=job,
            PRS=job.PRS,
            CaTrajPDBPath=job.CaTrajPDBPath,
            PRSNumPertubations=job.PRSNumPertubations,
            PRSHessianMethod=job.PRSHessianMethod,
            PRSDistanceThreshold=job.PRSDistanceThreshold,
            PRSCosineThreshold=job.PRSCosineThreshold,
            EHH=job.EHH,
            EHHCovarianceMethod=job.EHHCovarianceMethod,
            EHHMaxIterations=job.EHHMaxIterations,
            EHHAlpha=job.EHHAlpha,
            EHHkBT=job.EHHkBT,
            EHHThreshold=job.EHHThreshold,
            EHHDistanceCutoff=job.EHHDistanceCutoff,
            CNA=job.CNA,
            CNAStepSize=job.CNAStepSize,
            SourceNode=job.SourceNode,
            TargetNode=job.TargetNode,
            save_folder=NRIMD_DATA_DIR+'/jobs/'+job.JobID+'/analysis/',
            JobID=job.JobID,
            AaTrajPDBPath=job.AaTrajPDBPath
        )
    except:
        pass
    return "Finished"

class JobAPIView(APIView):
    def get(self,request):
        file = JobModel.objects.all()
        serializer = JobSerializer(instance=file,many=True)
        return Response(serializer.data)
    def post(self,request):
        # try:
        try:
            if(request.META.has_key('HTTP_X_FORWARDED_FOR')):
                ip = request.META['HTTP_X_FORWARDED_FOR']
        except:
            try:
                ip = request.META['REMOTE_ADDR']
            except:
                ip = "127.0.0.1"
        # get IP
        data_dict = request.data
        data_dict['IP'] = ip
        # generate jobid
        jobid = generate_jobid(JobModel) 
        data_dict['JobID'] = jobid
        # sample
        print(data_dict['Example'])
        filepath=data_dict['CaTrajPDBPath']
        if not data_dict['Example']:
            generate_pdb4pv_from_nri_catraj(
                REMO=REMO_DIR,
                traj_path=filepath, 
                out_pvpdb_path= PV_PDB_DIR + jobid +'.pdb'
            )
            data_dict['StrucPDBPath'] = PV_PDB_DIR + jobid +'.pdb'
        else:
            if data_dict["Sha1"] == EXAMPLE1_SHA1 or data_dict["Sha1"] == EXAMPLE1_ZIP_SHA1:
                data_dict['StrucPDBPath'] = PV_PDB_DIR + 'sod1.pdb'
            elif data_dict["Sha1"] == EXAMPLE2_SHA1 or data_dict["Sha1"] == EXAMPLE2_ZIP_SHA1:
                data_dict['StrucPDBPath'] = PV_PDB_DIR + 'PSH.pdb'
            else:
                pass
        head,tail =os.path.split(filepath)
        newname = "{}_{}_{}.pdb".format(jobid, str(data_dict['NumResidues']),str(data_dict['NumFrames']))
        newpath = head+"/"+newname
        os.rename(filepath, newpath)
        data_dict['CaTrajPDBPath']=newpath # rename traj path

        if data_dict['Sample'] == True:
            sampled_path = head+"/{}_sampled.pdb".format(jobid)
            if data_dict['SampleStrategy'] == 1:
                old_idxs = numerical_sampling(newpath, sampled_path, data_dict['Sample1Arg1'], data_dict['Sample1Arg2'] )
            elif data_dict['SampleStrategy'] == 2:
                old_idxs = probability_sampling(newpath,sampled_path, data_dict['Sample2Arg1'])
            elif data_dict['SampleStrategy'] == 3:
                old_idxs = domain_sampling(newpath,sampled_path, data_dict['Domains'])
            num_redidues = len(old_idxs)
            newname = "{}_{}_{}.pdb".format(jobid, str(num_redidues),str(data_dict['NumFrames']))
            newpath = head + "/" + newname
            os.rename(sampled_path, newpath)
            data_dict['SampledNumResidues'] = num_redidues
            data_dict['SampleSerials'] = '_'.join(list(map(str, old_idxs)))
            data_dict['SampledCaTrajPDBPath'] = newpath
            
        # data_dict['JobStatus']="Running"
        serializer=JobSerializer(data=data_dict)
        serializer.is_valid(raise_exception=True) # params check here
        serializer.save()
        print(str(jobid)+' is created !')
        job = JobModel.objects.get(JobID=jobid)

        job.PRSSourceNode = job.SourceNode
        job.PRSTargetNode = job.TargetNode
        job.EHHSourceNode = job.SourceNode
        job.EHHTargetNode = job.TargetNode
        job.CNASourceNode = job.SourceNode
        job.CNATargetNode = job.TargetNode
        job.DomainVisualThreshold = job.VisualThreshold
        job.PathDistThreshold = job.DistThreshold

        job.save()
        # example
        if job.Example:
            if data_dict["Sha1"] == EXAMPLE1_SHA1 or data_dict["Sha1"] == EXAMPLE1_ZIP_SHA1:
                sourcepath = NRIMD_DATA_DIR + '/sod_example'
            elif data_dict["Sha1"] == EXAMPLE2_SHA1 or data_dict["Sha1"] == EXAMPLE2_ZIP_SHA1:
                sourcepath = NRIMD_DATA_DIR + '/psh_example'
            else:
                pass
            targetpath = NRIMD_DATA_DIR + '/jobs/' + jobid
            shutil.copytree(sourcepath, targetpath)
            job.JobStatus="Finished"
            job.save()
            print("email",job.Email)
            if job.Email != None:
                mail.send_mail(
                    subject='NRIMD example job {} finished'.format(job.Name),
                    message='Your NRIMD example job has finished, your result is availabe at https://nrimd.luddy.iupui.edu/result/{}'.format(jobid),
                    from_email=EMAIL_HOST_USER,
                    recipient_list=['{}'.format(job.Email)]
                )
            return Response({"code":1, "infos":{"JobID":jobid}, "message":"finished"})
        # submit job
        if NRI_COMPUTE_LOCALHOST:
            scheduler.add_job(calculateAllLocalHost,args=[job])
        else:
            nri_hpc(
                JobID=job.JobID,
                CatrajPDBName=newname,
                SampleStart=job.SampleStart,
                SampleEnd=job.SampleEnd,
                TimeStepSize=job.TimeStepSize,
                TrainInterval=job.TrainInterval,
                ValidateInterval=job.ValidateInterval,
                TestInterval=job.TestInterval,
                Seed=job.Seed,
                Epochs=job.Epochs,
                Lr=job.Lr,
                Encoder_hidden=job.EncoderHidden,
                Decoder_hidden=job.DecoderHidden,
                Encoder=job.Encoder,
                Decoder=job.Decoder,
                EncoderDropout=job.EncoderDropout,
                DecoderDropout=job.DecoderDropout,
                LrDecay=job.LrDecay,
                Gamma=job.Gamma,
                Var=job.Var,
                DistThreshold=job.DistThreshold,
                SourceNode=job.SourceNode,
                TargetNode=job.TargetNode,
                VisualThreshold=job.VisualThreshold,
                Domains=job.Domains,
            ) 
        return Response({"code":1, "infos":{"JobID":jobid}, "message":"success"})
        # except:
        #     return Response({"code":0, "infos":{}, "message":"sorry, web server error"})

class CaTrajectoryPDBAPIView(APIView):
    # def get(self,request):
    #     file = CaTrajectoryPDBModel.objects.all()
    #     serializer = CaTrajectoryPDBModelSerializer(instance=file, many=True)
    #     return Response(serializer.data)
    def post(self,request):
        file = request.data['file']
        filename = str(file.name)
        times = str(time.time()).split('.').pop()
        filename = times + '_' + filename
        filepath = os.path.join(NRIMD_DATA_DIR,"ca_trajs/",filename)
        with open(filepath, 'wb+') as destination:
            for chunk in request.data['file'].chunks():
                destination.write(chunk)
        destination.close()
        # dict_data={"CaTrajectoryPDB":filepath}
        # CaTrajectoryPDBModel.objects.create(**dict_data)
        return Response(validate_ca_traj_pdb(filepath))

class AaTrajectoryPDBAPIView(APIView):
    # def get(self,request):
    #     file = AaTrajectoryPDBModel.objects.all()
    #     serializer = AaTrajectoryPDBModelSerializer(instance=file,many=True)
    #     return Response(serializer.data)
    def post(self,request):
        file=request.data['file']
        filename = str(file.name)
        times = str(time.time()).split('.').pop()
        filename = times + '_'+filename
        filepath = os.path.join(NRIMD_DATA_DIR,"aa_trajs/",filename)
        with open(filepath, 'wb+') as destination:
            for chunk in request.data['file'].chunks():
                destination.write(chunk)
        destination.close()
        # dict_data={"AaTrajectoryPDB":filepath}
        # AaTrajectoryPDBModel.objects.create(**dict_data)
        return Response(validate_aa_traj_pdb(filepath))

class StructurePDBAPIView(APIView):
    # def get(self,request):
    #     file = StructurePDBModel.objects.all()
    #     serializer = StructurePDBModelSerializer(instance=file,many=True)
    #     return Response(serializer.data)
    def post(self,request):
        file=request.data['file']
        filename = str(file.name)
        times = str(time.time()).split('.').pop()
        filename = times + '_'+filename
        filepath = os.path.join(PV_PDB_DIR, filename)
        with open(filepath, 'wb+') as destination:
            for chunk in request.data['file'].chunks():
                destination.write(chunk)
        destination.close()
        # dict_data={"StructurePDB":filepath}
        # StructurePDBModel.objects.create(**dict_data)
        return Response({'StrucPDBPath':filepath})






