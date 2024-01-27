from . import submit_view, download_view, result_view
from rest_framework.routers import DefaultRouter
from django.urls import re_path as url

urlpatterns=[
    url('submit/upload_catraj/',submit_view.CaTrajectoryPDBAPIView.as_view()),
    url('submit/upload_aatraj/',submit_view.AaTrajectoryPDBAPIView.as_view()),
    url('submit/upload_strucpdb/',submit_view.StructurePDBAPIView.as_view()),
    url('submit/submit_job/',submit_view.JobAPIView.as_view()),
    url('result/check_job/', result_view.ResultAPIView.as_view()),
    url('result/reres_nri/', result_view.reresAPIView.as_view()),
    url('result/redomain_nri/', result_view.redomainAPIView.as_view()),
    url('result/recov_nri/', result_view.recovAPIView.as_view()),
    url('result/repath_nri/', result_view.repath_nri),
    url('result/repath_prs/', result_view.repath_prs),
    url('result/repath_ehh/', result_view.repath_ehh),
    url('result/repath_cna/', result_view.repath_cna),
    url('download/download_psh_catraj/',download_view.download_psh_catraj),
    url('download/download_sod_catraj/',download_view.download_sod_catraj),
    url('download/download_python_script/',download_view.download_python_script),
    url('download/download_struc/',download_view.download_strucpdb),
    url('download/download_aatraj/',download_view.download_aatraj),
    url('download/download_result/(?P<id>[0-9]{4}[0-9a-zA-Z]{6})', download_view.DownloadResult),
]
