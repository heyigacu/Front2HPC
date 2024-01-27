import request from './request'

//submit
export const SubmitJobApi = (params) => request.post('/nrimd/submit/submit_job/', params)
export const submitExampleApi = (params) => request.post('/nrimd/submit_example/', params)

//get result
export const CheckApi = (params) => request.get('/nrimd/result/check_job/', {params})
export const recovNriApi = (params) => request.get('/nrimd/result/recov_nri/', {params})
export const reresNriApi = (params) => request.get('/nrimd/result/reres_nri/', {params})
export const redomainNriApi = (params) => request.get('/nrimd/result/redomain_nri/', {params})
export const repathNriApi = (params) => request.get('/nrimd/result/repath_nri/', {params})
export const repathPrsApi = (params) => request.get('/nrimd/result/repath_prs/', {params})
export const repathEhhApi = (params) => request.get('/nrimd/result/repath_ehh/', {params})
export const repathCnaApi = (params) => request.get('/nrimd/result/repath_cna/', {params})

//download result
export const downloadResultAPI = (params) => request.get('/download/download_result/', {params})