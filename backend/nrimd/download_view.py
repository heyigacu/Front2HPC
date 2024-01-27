
from django.shortcuts import render
import zipfile
import os
from django.http import FileResponse
from backend.settings import NRIMD_DATA_DIR, BASE_DIR, STATIC_URL

PARENT_DIR = os.path.dirname(os.path.abspath(__file__))
# Create your views here.



####################
## download result
####################
def DownloadResult(request,id):
    inputpath=NRIMD_DATA_DIR+'/jobs/'+id+'/analysis'
    outpath = NRIMD_DATA_DIR+'/jobs/'+id+'/'+id+'_result'+'.zip'
    zip = zipfile.ZipFile(outpath, 'w', zipfile.ZIP_DEFLATED)
    for path, dirnames, filenames in os.walk(inputpath):
        fpath = path.replace(inputpath, '')
        for filename in filenames:
            zip.write(os.path.join(path, filename), os.path.join(fpath, filename))
    zip.close()
    file = open(outpath, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="result.zip"'
    return  response



def download_sod_catraj(request):
    path=PARENT_DIR+'/statics/files/SOD1_ca_traj.zip'
    print(path)
    file = open(path, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="SOD1_ca_traj.zip"'
    return response



def download_psh_catraj(request):
    path=PARENT_DIR+'/statics/files/PSH_ca_traj.zip'
    print(path)
    file = open(path, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="PSH_ca_traj.pdb"'
    return response




def download_aatraj(request):
    path=PARENT_DIR+'/statics/files/SOD1_aa_traj.zip'
    print(path)
    file = open(path, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="SOD1_aa_traj.zip"'
    return response


def download_strucpdb(request):
    path=BASE_DIR+STATIC_URL+'pdbs/sod1.pdb'
    print(path)
    file = open(path, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="sod1.pdb"'
    return response


# #===========================view: download python script===========================

def download_python_script(request):
    path=PARENT_DIR+'/statics/files/traj2CApdb.zip'
    file = open(path, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="traj2CApdb.zip"'
    return response
