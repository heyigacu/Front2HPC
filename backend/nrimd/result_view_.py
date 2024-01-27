from django.shortcuts import render

# Create your views here.
from .models import JobModel
from .serializers import JobSerializer
from backend.settings import NRIMD_DATA_DIR
import os
import base64
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from .algorithms.nri.NRI import nri_visual,nri_path,nri_cov
from .algorithms.prs.PRS import prs_path
from .algorithms.ehh.EHH import ehh_path
from .algorithms.cna.CNA import cna_path
from .models import JobModel
COMPUTE_LOCALHOST = True

# from algorithm.nri.nri_postanalysis import nri_postanalysis

def png2base64(img_path):
	pro = open(img_path, 'rb')
	data = pro.read()
	b64 = base64.b64encode(data)
	pro.close()
	return b64

def parse_nri_path(pathfilepath):
    if os.path.exists(pathfilepath):
        source = open(pathfilepath, 'rb').readlines()
        for i in range(len(source)):
            source[i] = str(source[i],'utf-8').strip()
        paths = []
        for i,line in enumerate(source):
            if line.startswith('target node'):
                node = int(line.split(':')[1])
            else:
                # line.split(':')[1].split('->') 
                paths.append({'key':i,
                              'pathname':line.split(':')[0].strip(),
                              'path':line.split(':')[1].strip(),
                              'probability': '{:.2f}'.format(float(line.split(':')[2].strip()))
                              })
    return paths

def parse_cna_path(pathfilepath):
    if os.path.exists(pathfilepath):
        line = open(pathfilepath, 'r').readlines()[0].strip()[:-1]
        words = line.split('),')
        paths = []
        for i,raw_path in enumerate(words):
            raw_path = raw_path.strip()[2:]
            node_ls = raw_path.split(', ')
            path = '->'.join(node_ls)
            paths.append({'key':i+1,
                            'pathname': str(i+1),
                            'path':path,
                            })
    return paths

class ResultAPIView(APIView):
    def get(self, request):
        jobid = request.GET.get('JobID')
        jobfolder = os.path.join(NRIMD_DATA_DIR,"jobs/",jobid)
        result_folder = os.path.join(NRIMD_DATA_DIR,"jobs/",jobid,"analysis/")
        try:
            job = JobModel.objects.get(JobID=jobid)
        except:
            return Response({"code":0, "infos":{}, "message": f'your job ({jobid}) not exist!'}) 
        if job.JobStatus == "Running": 
            return Response({"code":1, "infos":{'JobStatus':"Running",'Created_at':job.Created_at}, "message":'Success'})
        elif job.JobStatus == "Failed":
            return Response({"code":0, "infos":{'JobStatus':"Failed",'Created_at':job.Created_at, 'Reason':'Webserver Error'}, "message":'Job Failed!'})        
        elif job.JobStatus == "Finished":
        # try:
            data = {}
            nri = {}
            nri['res'] = png2base64(result_folder+"nri_res.png")
            nri['cov'] = png2base64(result_folder+"nri_cov.png")
            try:
                nri['path'] = parse_nri_path(result_folder+"nri_path.txt")
            except:
                nri['path'] = []
            if job.Domains != ',':
                try:
                    nri['domain'] = png2base64(result_folder+"nri_domain.png")
                except:
                    nri['domain'] = None
            nri['Sample'] = job.Sample
            nri['SampleSerials'] = job.SampleSerials
            nri['SourceNode'] = job.SourceNode
            nri['TargetNode'] = job.TargetNode
            nri['PathDistThreshold'] = job.PathDistThreshold
            nri['DomainVisualThreshold'] = job.DomainVisualThreshold
            nri['VisualThreshold'] = job.VisualThreshold
            nri['Domains'] = job.Domains
            nri['DistThreshold'] = job.DistThreshold
            data['nri'] = nri
            if  job.PRS:   
                prs = {}
                prs['cov'] = png2base64(result_folder+"prs_cov.png")
                prs['res'] = png2base64(result_folder+"prs_res.png")
                prs['path'] = parse_nri_path(result_folder+"prs_path.txt")
                prs['CosineThreshold'] = job.PRSCosineThreshold
                prs['NumPertubation'] = job.PRSNumPertubations
                prs['DistThreshold'] = job.PRSDistanceThreshold
                prs['PRSSourceNode'] = job.PRSSourceNode
                prs['PRSTargetNode'] = job.PRSTargetNode
                data['prs'] = prs

            if job.EHH:
                ehh = {}
                ehh['cov'] = png2base64(result_folder+"ehh_cov.png")
                ehh['path'] = parse_cna_path(result_folder+"ehh_path.txt")
                ehh['EHHSourceNode'] = job.EHHSourceNode
                ehh['EHHTargetNode'] = job.EHHTargetNode
                data['ehh'] = ehh
            if job.CNA:
                cna = {}
                cna['cov'] = png2base64(result_folder+"cna_cov.png")
                cna['path'] = parse_cna_path(result_folder+"cna_path.txt")
                cna['CNASourceNode'] = job.CNASourceNode
                cna['CNATargetNode'] = job.CNATargetNode
                data['cna'] = cna
            return Response({"code":1,"Message":"Success","infos":
                            {
                            'JobStatus':'Finished',
                            'data': data,
                            'StrucPDBPath':job.StrucPDBPath,
                            'Example':job.Example,
                            'Created_at':job.Created_at,
                            'PRS':job.PRS,
                            'EHH':job.EHH,
                            'CNA':job.CNA,
                            'NumResidues':job.NumResidues
                            }})
            # except:
            #     return Response({"code":0, "infos":{'JobStatus':"Failed",'Created_at':job.Created_at, 'Reason':'Result Error'}, "message":'Job Failed!'})        

class reresAPIView(APIView):
    def get(self,request):
        JobID  = request.GET['JobID']
        VisualThreshold = float(request.GET['VisualThreshold'])
        job = JobModel.objects.get(JobID=JobID)
        result_folder = NRIMD_DATA_DIR + 'jobs/' + JobID + '/analysis/'
        job.VisualThreshold = VisualThreshold
        job.save()
        nri_visual(
            jobsdata_dir = NRIMD_DATA_DIR,
            JobID = job.JobID,
            NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
            SampleStart=job.SampleStart,
            SampleEnd=job.SampleEnd,
            VisualThreshold=VisualThreshold,
            Domains=job.Domains,
            SampleSerials=job.SampleSerials,
        )  
        img_res = png2base64(result_folder+'nri_res.png')
        return Response({'img':img_res})

class recovAPIView(APIView):
    def get(self,request):
        JobID  = request.GET['JobID']
        DistThreshold = int(request.GET['DistThreshold'])
        job = JobModel.objects.get(JobID=JobID)
        job.DistThreshold = DistThreshold
        result_folder = NRIMD_DATA_DIR + 'jobs/' + JobID + '/analysis/'
        job.save()
        nri_cov(
            jobsdata_dir = NRIMD_DATA_DIR,
            CatrajPDBPath = job.SampledCaTrajPDBPath if job.Sample else job.CaTrajPDBPath,
            JobID = job.JobID,
            NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
            SampleStart=job.SampleStart,
            SampleEnd=job.SampleEnd,
            DistThreshold=DistThreshold,
            SampleSerials=job.SampleSerials,
        )
        img_cov = png2base64(result_folder+'nri_cov.png')
        return Response({'img':img_cov})

class redomainAPIView(APIView):
    def get(self,request):
        JobID  = request.GET['JobID']
        Domains = request.GET['Domains']
        DomainVisualThreshold = float(request.GET['DoaminVisualThreshold'])
        job = JobModel.objects.get(JobID=JobID)
        job.Domains = Domains
        job.DomainVisualThreshold = DomainVisualThreshold
        result_folder = NRIMD_DATA_DIR + 'jobs/' + JobID + '/analysis/'
        job.save()
        nri_visual(
            jobsdata_dir = NRIMD_DATA_DIR,
            JobID = job.JobID,
            NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
            SampleStart=job.SampleStart,
            SampleEnd=job.SampleEnd,
            VisualThreshold=DomainVisualThreshold,
            Domains=Domains,
            SampleSerials=job.SampleSerials,
        )
        img = png2base64(result_folder+'/nri_domain.png')
        return Response({'img':img})


def repath_nri(request):
    print(request.GET)
    JobID  = request.GET['JobID']
    PathDistThreshold  = int(request.GET['PathDistThreshold'])
    SourceNode  = int(request.GET['SourceNode'])
    TargetNode  = int(request.GET['TargetNode'])
    job = JobModel.objects.get(JobID=JobID)
    job.PathDistThreshold = PathDistThreshold
    job.SourceNode = SourceNode
    job.TargetNode = TargetNode
    job.save()
    result_folder = NRIMD_DATA_DIR + 'jobs/' + JobID + '/analysis/'
    try:
        nri_path(
            CatrajPDBPath = job.SampledCaTrajPDBPath if job.Sample else job.CaTrajPDBPath,
            jobsdata_dir=NRIMD_DATA_DIR,
            JobID=job.JobID,
            NumResidues=job.SampledNumResidues if job.Sample else job.NumResidues,
            SampleStart=job.SampleStart,
            SampleEnd=job.SampleEnd,
            DistThreshold=PathDistThreshold,
            SourceNode=SourceNode,
            TargetNode=TargetNode,
            SampleSerials=job.SampleSerials
        )
        return JsonResponse({'path':parse_nri_path(result_folder+'/nri_path.txt'), 'code':1})
    except:
        return JsonResponse({'path':[], 'code':0, 'message':'error occurred in calculating allostery path'})

def repath_prs(request):
    print(request.GET)
    JobID  = request.GET['JobID']
    NumPertubation  = int(request.GET['NumPertubation'])
    DistThreshold  = float(request.GET['DistThreshold'])
    CosineThreshold = float(request.GET['CosineThreshold'])
    PRSSourceNode  = int(request.GET['PRSSourceNode'])
    PRSTargetNode  = int(request.GET['PRSTargetNode'])
    job = JobModel.objects.get(JobID=JobID)
    job.PRSSourceNode = PRSSourceNode
    job.PRSTargetNode = PRSTargetNode
    job.PRSCosineThreshold = CosineThreshold
    job.PRSDistanceThreshold = DistThreshold
    job.PRSNumPertubations = NumPertubation
    job.save()
    result_folder = NRIMD_DATA_DIR + 'jobs/' + JobID + '/analysis/'
    prs_path(
        traPDBpath = job.CaTrajPDBPath,
        dist_threshold=DistThreshold,
        hessian = job.PRSHessianMethod,
        save_folder = result_folder,
        source_node=PRSSourceNode,
        target_node=PRSTargetNode,
        cosine_threshold = CosineThreshold,
        n_ticks = NumPertubation,
    )
    return JsonResponse({'path':parse_nri_path(result_folder+'/prs_path.txt')})


def repath_ehh(request):
    print(request.GET)
    JobID  = request.GET['JobID']
    EHHSourceNode  = int(request.GET['EHHSourceNode'])
    EHHTargetNode  = int(request.GET['EHHTargetNode'])
    result_folder = NRIMD_DATA_DIR + 'jobs/' + JobID + '/analysis/'
    job = JobModel.objects.get(JobID=JobID)
    job.EHHSourceNode = EHHSourceNode
    job.EHHTargetNode = EHHTargetNode
    job.save()
    ehh_path(
        jobid=JobID,
        jobsdata_dir=NRIMD_DATA_DIR,
        source_node=EHHSourceNode,
        target_node=EHHTargetNode,  
    )
    return JsonResponse({'path':parse_cna_path(result_folder+'/ehh_path.txt')})

def repath_cna(request):
    print(request.GET)
    JobID  = request.GET['JobID']
    CNASourceNode  = int(request.GET['CNASourceNode'])
    CNATargetNode  = int(request.GET['CNATargetNode'])
    result_folder = NRIMD_DATA_DIR + 'jobs/' + JobID + '/analysis/'
    job = JobModel.objects.get(JobID=JobID)
    job.CNASourceNode = CNASourceNode
    job.CNATargetNode = CNATargetNode
    job.save()
    print(CNATargetNode)
    cna_path(
        jobid=JobID,
        jobsdata_dir=NRIMD_DATA_DIR,
        source_node=CNASourceNode,
        target_node=CNATargetNode,    
    )
    return JsonResponse({'path':parse_cna_path(result_folder+'/cna_path.txt')})




