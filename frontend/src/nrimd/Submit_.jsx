
import React, { useState,useEffect, useRef } from 'react'
import { useNavigate, Link, Await, } from 'react-router-dom';
import { ConfigProvider, Modal, Affix, Checkbox, Collapse, Switch, Button, Form, Input, InputNumber, ColorPicker, Radio, message, Upload ,Slider, Card, Space, Divider, Col, Row, Select } from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, DownOutlined, UpOutlined, SettingOutlined, LoadingOutlined,CaretRightOutlined  } from '@ant-design/icons';
import VisualThresholdHelp from './components/submit_components/VisualThresholdHelp'
import DistThresholdHelp from './components/submit_components/DistThresholdHelp'
import DomainsHelp from './components/submit_components/DomainsHelp'
import SourceTargteHelp from './components/submit_components/SourceTargteHelp'
import SubmitSuccessful from './components/submit_components/SubmitSuccessful'
import SubmitFailed from './components/submit_components/SubmitFailed'
import SubmittingLogo from './components/submit_components/SubmittingLogo'
import {SubmitJobApi} from './requests/api'
import ExampleTrajDrawer from './components/intro_components/ExampleStrucPDBDrawer.jsx'
import probability_sampling from "./assets/images/submit/probability_sampling.png"
import numerical_sampling from "./assets/images/submit/numerical_sampling.png"
import domain_sampling from "./assets/images/submit/domain_sampling.png"
import SampleTip from './components/submit_components/SampleTip'
const VALID_TRAJ_FILE_SIZE = 20
const VALID_TRAJ_RESIDUES = 5000
const VALID_TRAJ_FRAMES = 10000
const SAMPLE_THRESHOLD = 300
const EXAMPLE1_SHA1 = "19cf847c8f767fd078926e51cc6d297376e1da2d"
const EXAMPLE1_ZIP_SHA1 = "19cf847c8f767fd078926e51cc6d297376e1da2d"
const EXAMPLE2_SHA1 = "8b00caf1ce903d6311286687c25af668725b5cd4"
const EXAMPLE2_ZIP_SHA1 = "8b00caf1ce903d6311286687c25af668725b5cd4"
const content_background_color =  "rgba(237,239,247)"
const font_color = "rgba(17, 34, 100)"

const validateMessages = {
  required: '${label} is required!',
  types: {  email: '${label} is a not a valid email!',},
};

const Drawer = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <a type="primary" onClick={()=>setIsModalOpen(true)}>More </a>
      <Modal title={props.title} footer={null} open={isModalOpen} closable={false} okText={false} cancelText={false} width={1000}>
        <div>
            {props.content}
        </div> 
        <div style={{textAlign:"right"}}><Button type="primary" onClick={()=>setIsModalOpen(false)}>OK</Button></div>
      </Modal>
    </>
  );
}
const EXAMPLE1_PARAMS = {
  VisualThreshold: 0.6, DistThreshold:12, 
  Domains: 'β-1_1_48,DL_49_54,DiL_55_60,ZL_61_82,β-2_83_121,EL_122_141,β-3_142_153',
  SourceNode:93, TargetNode:134,
  SampleStart:1, SampleEnd: 56, TrainInterval:60, ValidateInterval:80, TestInterval:100,TimeStepSize:50,
  Epochs:200, Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
  Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0., DecoderDropout:0., // no effects
  PRS: true, PRSNumPertubations:100, PRSHessianMethod:1, PRSDistanceThreshold:10, PRSCosineThreshold:0.5, // no effects
  EHH: true, EHHCovarianceMethod:1, EHHMaxIterations:100, EHHAlpha:0.01, EHHkBT:0.592, EHHThreshold:1e-4, EHHDistanceCutoff:5, // no effects
  CNA: true, CNAStepSize:50, // no effects
  Sample:false, SampleStrategy:1, Sample1Arg1:1, Sample1Arg2:3, Sample2Arg1:3,
  AaTrajPDBPath:"/media/volume/sdb/jobs/aa_trajs/example_aa_traj.pdb"

}


const CONT_EXAMPLE1_PARAMS = {
  VisualThreshold: 0.6, DistThreshold:12, 
  domain_infos:[{domain_name:"β-1",domain_start:1,domain_end:48},
                {domain_name:"DL",domain_start:49,domain_end:54} ,
                {domain_name:"DiL",domain_start:55,domain_end:60},
                {domain_name:"ZL",domain_start:61,domain_end:82},
                {domain_name:"β-2",domain_start:83,domain_end:121},
                {domain_name:"EL",domain_start:122,domain_end:141},
                {domain_name:"β-3",domain_start:142,domain_end:153},
              ],
  SourceNode:93, TargetNode:134,
  SampleStart:1, SampleEnd: 56, TrainInterval:60, ValidateInterval:80, TestInterval:100,TimeStepSize:50,
  Epochs:200, Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
  Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0., DecoderDropout:0., // no effects
  PRSNumPertubations:100, PRSHessianMethod:1, PRSDistanceThreshold:10, PRSCosineThreshold:0.5, // no effects
  EHHCovarianceMethod:1, EHHMaxIterations:100, EHHAlpha:0.01, EHHkBT:0.592, EHHThreshold:1e-4, EHHDistanceCutoff:5, // no effects
  CNAStepSize:50, // no effects
  SampleStrategy:1, Sample1Arg1:1, Sample1Arg2:3, Sample2Arg1:3 
}

const EXAMPLE2_PARAMS = {
  VisualThreshold: 0.6, DistThreshold:12, 
  Domains: 'TM1_1_28,TM2_41_64,TM3_67_93,TM4_97_117,TM5_122_142,TM6_143_173,TM7_210_227,TM8_245_264,TM9_271_284',
  SourceNode:148, TargetNode:217,
  SampleStart:1, SampleEnd: 56, TrainInterval:60, ValidateInterval:80, TestInterval:100,TimeStepSize:50,
  Epochs:200, Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
  Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0., DecoderDropout:0., // no effects
  PRS: false, PRSNumPertubations:100, PRSHessianMethod:1, PRSDistanceThreshold:10, PRSCosineThreshold:0.5, // no effects
  EHH: false, EHHCovarianceMethod:1, EHHMaxIterations:100, EHHAlpha:0.01, EHHkBT:0.592, EHHThreshold:1e-4, EHHDistanceCutoff:5, // no effects
  CNA: false, CNAStepSize:50, // no effects
  Sample:true, SampleStrategy:1, Sample1Arg1:1, Sample1Arg2:3, Sample2Arg1:3,
}

const CONT_EXAMPLE2_PARAMS = {
  VisualThreshold: 0.6, DistThreshold:12, 
  domain_infos:[{domain_name:"TM1",domain_start:1,domain_end:28},
                {domain_name:"TM2",domain_start:41,domain_end:64},
                {domain_name:"TM3",domain_start:67,domain_end:93},
                {domain_name:"TM4",domain_start:97,domain_end:117},
                {domain_name:"TM5",domain_start:122,domain_end:142},
                {domain_name:"TM6",domain_start:143,domain_end:173},
                {domain_name:"TM7",domain_start:210,domain_end:227},
                {domain_name:"TM8",domain_start:245,domain_end:264},
                {domain_name:"TM9",domain_start:271,domain_end:284},
              ],
  SourceNode:148, TargetNode:217,
  SampleStart:1, SampleEnd: 56, TrainInterval:60, ValidateInterval:80, TestInterval:100,TimeStepSize:50,
  Epochs:200, Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
  Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0., DecoderDropout:0., // no effects
  PRSNumPertubations:100, PRSHessianMethod:1, PRSDistanceThreshold:10, PRSCosineThreshold:0.5, // no effects
  EHHCovarianceMethod:1, EHHMaxIterations:100, EHHAlpha:0.01, EHHkBT:0.592, EHHThreshold:1e-4, EHHDistanceCutoff:5, // no effects
  CNAStepSize:50, // no effects
  SampleStrategy:1, Sample1Arg1:1, Sample1Arg2:3, Sample2Arg1:3 
}


const COMMON_PARAMS = {
  VisualThreshold: 0.6, DistThreshold:12, 
  SourceNode:93, TargetNode:134,
  SampleStart:1, SampleEnd: 56, TrainInterval:60, ValidateInterval:80, TestInterval:100,TimeStepSize:100,
  Epochs:200, Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
  Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0., DecoderDropout:0., // no effects
  PRS: false, PRSNumPertubations:100, PRSHessianMethod:0, PRSDistanceThreshold:10, PRSCosineThreshold:0.5, // no effects
  EHH: false, EHHCovarianceMethod:1, EHHMaxIterations:100, EHHAlpha:0.01, EHHkBT:0.592, EHHThreshold:1e-4, EHHDistanceCutoff:5, // no effects
  CNA: false, CNAStepSize:50, // no effects
  Sample:false, SampleStrategy:1, Sample1Arg1:1, Sample1Arg2:3, Sample2Arg1:3 
}

const CONT_COMMON_PARAMS = {
  VisualThreshold: 0.6, DistThreshold:12, 
  SourceNode:93, TargetNode:134,
  SampleStart:1, SampleEnd: 56, TrainInterval:60, ValidateInterval:80, TestInterval:100, TimeStepSize:100,
  Epochs:200, Lr:0.0005, LrDecay:200, Gamma:0.5, Var:0.00005, Seed:42,
  Encoder:'mlp', Decoder:'rnn', EncoderHidden:256, DecoderHidden:256, EncoderDropout:0., DecoderDropout:0., // no effects
  PRSNumPertubations:100, PRSHessianMethod:0, PRSDistanceThreshold:10, PRSCosineThreshold:0.5, // no effects
  EHHCovarianceMethod:1, EHHMaxIterations:100, EHHAlpha:0.01, EHHkBT:0.592, EHHThreshold:1e-4, EHHDistanceCutoff:5, // no effects
  CNAStepSize:50, // no effects
  SampleStrategy:1, Sample1Arg1:1, Sample1Arg2:3, Sample2Arg1:3 
}



const parseDomainsString = (domain_string) =>{
  var domains = domain_string.trim().split(',')
  const domains_info = new Array()
  var paths = paths.trim().split(',') 
  for(var i = 0; i < domains.length; i++) {
    var words = domains[i].trim().split('_')
    domains_info.push({'domain_name':words[0], 'domain_start':words[1], 'domain_end':words[2]})
  }
  return domains_info
}

const reduceDomains2String = (domains_info) =>{
  try{
    return domains_info.map(obj => obj.domain_name+'_'+String(obj.domain_start)+'_'+String(obj.domain_end)).join(',')
  }catch(err){
    return 
  }
}



const Submit = () => {
  const navigate = useNavigate()
  const [controlledSubmitForm] = Form.useForm()
  const [userSubmitForm, setUserSubmitForm] = useState([]); 

  const [catrajFileList, setCatrajFileList] = useState([]);
  const [aatrajFileList, setAatrajFileList] = useState([]);

  const [proteinLength, setProteinLength] = useState(); 
  const [proteinFrames, setProteinFrames] = useState(); 
  const [aaTrajFrames, setAaTrajFrames] = useState(); 
  const [needSample, setNeedSample] = useState(false)
  const [example, setExample] = useState(-1)
  const [ifSubmitSuccessful, setIfSubmitSuccessful] = useState(false)
  const [ifSubmitting, setIfSubmitting] = useState(false)
  const [ifSubmitForm, setIfSubmitForm] = useState(true)
  const [jobID, setJobID] = useState()

  ///////////// mount \\\\\\\\\\\\\\\\\
  useEffect(()=>{
    if(example==0){
      controlledSubmitForm.setFieldsValue(CONT_COMMON_PARAMS)
      setUserSubmitForm({...userSubmitForm, ...COMMON_PARAMS, Sample:needSample, })
    }else if(example==1){
      controlledSubmitForm.setFieldsValue(CONT_EXAMPLE1_PARAMS)
      setUserSubmitForm({...userSubmitForm, ...EXAMPLE1_PARAMS, Sample:needSample, })
    }else if(example==2){
      controlledSubmitForm.setFieldsValue(CONT_EXAMPLE2_PARAMS)
      setUserSubmitForm({...userSubmitForm, ...EXAMPLE2_PARAMS, Sample:needSample, })
    }
    else{
      
    }
  },[example])
  
  const CaTrajProps = {
    beforeUpload: (file, fileList) => {
      const fileType = file.name.substr(file.name.lastIndexOf(".")).toLowerCase();  
      if (fileType !== '.pdb' && fileType !== '.zip') {
          message.error('only support pdb and zip format')
          const index = fileList.indexOf(file)
          fileList.splice(index, 0);
          return false
      }     
      const islt5M =  file.size / 1024 / 1024 < VALID_TRAJ_FILE_SIZE;
      if (!islt5M) {
          message.error(`file size should be less than ${VALID_TRAJ_FILE_SIZE}MB`)
          const index = fileList.indexOf(file)
          fileList.splice(index, 0)
          return false
      }
    },
    action:'/api/nrimd/submit/upload_catraj/',
    multiple:false,
    onChange: (info) => {
      let newFileList = [...info.fileList];
      newFileList = newFileList.slice(-1);
      setCatrajFileList(newFileList);
      newFileList = newFileList.map((file) => {
        if(file.response){
          console.log(file.response);
          if(file.response.code == 1){
            setProteinLength(file.response.infos.numResidues)
            setProteinFrames(file.response.infos.numFrames)
            setNeedSample(file.response.infos.numResidues > SAMPLE_THRESHOLD)
            if(file.response.infos.sha1==EXAMPLE1_SHA1 || file.response.infos.sha1==EXAMPLE1_ZIP_SHA1){
              setExample(1)
              setAatrajFileList([{name: "aa_traj.pdb"}])
              setUserSubmitForm({...userSubmitForm, Example: true,CaTrajPDBPath:file.response.infos.CaTrajPDBPath, Sha1:file.response.infos.sha1, NumResidues:file.response.infos.numResidues, NumFrames:file.response.infos.numFrames, CNA:true, PRS:true, EHH:true})
            }else if(file.response.infos.sha1==EXAMPLE2_SHA1 || file.response.infos.sha1==EXAMPLE2_ZIP_SHA1){
              setExample(2)
              setUserSubmitForm({...userSubmitForm, Example: true,CaTrajPDBPath:file.response.infos.CaTrajPDBPath, Sha1:file.response.infos.sha1, NumResidues:file.response.infos.numResidues, NumFrames:file.response.infos.numFrames, CNA:false, PRS:false, EHH:false})
            }else{
              setExample(0)
              setUserSubmitForm({...userSubmitForm, Example: false,CaTrajPDBPath:file.response.infos.CaTrajPDBPath, Sha1:file.response.infos.sha1, NumResidues:file.response.infos.numResidues, NumFrames:file.response.infos.numFrames})
            }
            // if(file.response.infos.numResidues > SAMPLE_THRESHOLD){
            //   message.warning("because length of your protein is greater than 500 residues, you must choose one sampling method below:")
            // }
          }else{
            message.error(file.response.message)
          }
        }
        return file;
      });
    },
  };

  const AaTrajProps = {

    beforeUpload: (file, fileList) => {

      const fileType = file.name.substr(file.name.lastIndexOf(".")).toLowerCase();  
      if (fileType !== '.pdb' && fileType !== '.zip') {
          message.error('only support pdb and zip format')
          const index = fileList.indexOf(file)
          fileList.splice(index, 0);
          return false
      }     
      const islt5M =  file.size / 1024 / 1024 < VALID_TRAJ_RESIDUES;
      if (!islt5M) {
          message.error(`file size should be less than ${VALID_TRAJ_RESIDUES}MB`)
          const index = fileList.indexOf(file)
          fileList.splice(index, 0)
          return false
      }
    },
    action:'/api/nrimd/submit/upload_aatraj/',
    onChange: (info) => {
      let newFileList = [...info.fileList];
      newFileList = newFileList.slice(-1);
      setAatrajFileList(newFileList);
      newFileList = newFileList.map((file) => {
        if(file.response){
          if(file.response.code == 1){
            setUserSubmitForm({...userSubmitForm, AaTrajPDBSha1:file.response.infos.sha1, AaTrajPDBPath:file.response.infos.AaTrajPDBPath})
            setAaTrajFrames(file.response.infos.numFrames)
          }else{
            message.error(file.response.message)
          }
        }
        return file;
      });
  
    },
  };

  const SubmitSuccessfulFailed = () =>{
    if(ifSubmitSuccessful){
        return <SubmitSuccessful jobid={jobID}/>
    }else{
        return <SubmitFailed/>
    }
  }

  const onFinish = async (values) => {
    setIfSubmitting(true)
    var final_example = false 
    if(
      Object.keys(EXAMPLE1_PARAMS).every(key => EXAMPLE1_PARAMS[key] === userSubmitForm[key]) || Object.keys(EXAMPLE2_PARAMS).every(key => EXAMPLE2_PARAMS[key] === userSubmitForm[key])
    ){
      final_example = true
    }
    const res = await SubmitJobApi({...userSubmitForm, Example:final_example})
    if(res.code==1){
      setJobID(res.infos.JobID)
      setIfSubmitSuccessful(true)
      setTimeout(()=>{
        setIfSubmitForm(false)
        setIfSubmitting(false)
        message.success('Submit Successfully')
      }, 1000)
      navigate('/result/'+res.infos.JobID)
    }else{
      setIfSubmitSuccessful(true)
      setTimeout(()=>{
        setIfSubmitForm(false)
        setIfSubmitting(false)
        message.success(res.message)
    }, 1000)
    }
  };
  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  };
     
  let submitForm = <>
  <ConfigProvider theme={{components: { Form: {itemMarginBottom:"1vh", }, Collapse: {contentPadding: "1.5vh 1%", contentBg:content_background_color}, Card: {headerHeight:"4vh",actionsBg:content_background_color,}, Button:{defaultBg:content_background_color}}, }}>
  <Form name="basic" form={controlledSubmitForm} validateMessages={validateMessages} labelCol={{ span: 8,}} wrapperCol={{ span: 16, }} style={{ maxWidth:"80%",marginTop:"2vh" }} initialValues={{ remember: true, }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
    <Form.Item name="JobFile" label="Trajectory File" rules={[{ required: true, },]} extra="upload protein trajectory pdb file (only include CA atoms) or it's zip file, file size should < 20MB">
      <Upload {...CaTrajProps} fileList={catrajFileList} >
        <Button icon={<UploadOutlined />}>Upload Ca trajectory</Button> &nbsp;&nbsp;&nbsp;<span onClick={(e)=>{e.stopPropagation()}}><ExampleTrajDrawer/></span>
      </Upload>
    </Form.Item>

    <Form.Item name="SampleStrategy" label="Sample Method" rules={[{required:needSample}]} hidden={!needSample}>
      <Radio.Group onChange={(e) => {setUserSubmitForm({ ...userSubmitForm, SampleStrategy: e.target.value })}} style={{width:"100%"}}>
          <Collapse defaultActiveKey={[]}
              onChange={()=>{}}
              expandIconPosition='end'
              items={[
                {
                  key: '1',
                  label: <Radio value={1} >Numerical Sampling 
                    </Radio>,
                  children:<div>
                    <Form.Item name="Sample1Arg1" label="Offset" rules={[{type:"number",min:1, max:10000,}, 
                            ()=>({
                              validator(_,value){
                                  if(proteinLength != 0 && proteinLength != undefined ){
                                      if(value > proteinLength){
                                          return Promise.reject(new Error(`\'Offset\' should be less than protein length(${proteinLength}) !`))
                                      }
                                  }
                                  return Promise.resolve()
                              }
                          })
                    ]} extra="offset site as sampling start site">   
                          <InputNumber style={{width:"30%"}} precision={0} onChange={(e) => setUserSubmitForm({ ...userSubmitForm, Sample1Arg1: Number(e)})} placeholder='default 1' addonAfter=""/>
                      </Form.Item>
                      <Form.Item style={{marginBottom:0}} name="Sample1Arg2" label="Step" rules={[{type:"number", min:1, max:1000, },
                          ({getFieldValue})=>({
                            validator(_,value){
                                var offset =getFieldValue('Sample1Arg1')
                                if(proteinLength != 0 && proteinLength != undefined ){
                                  if(value > proteinLength){
                                    return Promise.reject(new Error(`\'Step\' should be less than protein length(${proteinLength}) !`))
                                    }
                                }
                                return Promise.resolve()
                            }
                        })  
                    ]} extra="sampling step" >   
                          <InputNumber style={{width:"30%"}} precision={0} onChange={(e) => setUserSubmitForm({ ...userSubmitForm, Sample1Arg2: Number(e)})} placeholder='sample step' addonAfter=""/>
                      </Form.Item>
                  </div>,
                  extra: <span onClick={(e)=>{e.stopPropagation()}}>
                  <Drawer 
                  title="Numerical Sampling" 
                  content={<>
                  <div>
                  The numerical sampling strategy selects residues at fixed intervals to extract the main skeleton of proteins.
                  This strategy is achieved by two user-defined parameters: the offset residue presented and the step length.    
                  </div>
                  <img src={numerical_sampling} style={{width:"50%", display:"block", border:"1px solid gray"}}></img>
                  <div>
                    In the figure above, offset is set to 1, and step is set to 3. 
                    The resulting compressed sequence contains 7 residues from the original sequence with 20 residues. 
                    The corresponding compression ratio is 5. 
                    If offset is set to 1 and step is also set to 1, the sampled protein sequence will not be compressed. 
                    This strategy is easy to implement but may not preserve the biological meaning of the original sequence in many cases.
                  </div>
                  </>}/>
                </span>,
                },
                {
                  key: '2',
                  label: <Radio value={2} >Probability Sampling 
                    </Radio>,
                  children: <div>
                    <Form.Item style={{marginBottom:0}} name="Sample2Arg1" label="Ratio" rules={[{type:"number",min: 1, max: 1000, }]} extra="the ratio to sample a kind of amino acid" >   
                        <InputNumber style={{width:"30%"}} precision={0} onChange={(e) => {setUserSubmitForm({ ...userSubmitForm, Sample2Arg1: Number(e)});}} placeholder='sample ratio' addonAfter=""/>
                    </Form.Item>                
                  </div>,
                  extra: <span onClick={(e)=>{e.stopPropagation()}}>
                  <Drawer 
                      title="Numerical Sampling" 
                      content={<>
                      <div>Probability sampling aims to preserve the relative composition of residue types after compression. 
                        Proteins are composed of 20 different types of residue, and we can sample every type amino acid according to a defined ratio. </div> 
                      <img src={probability_sampling} style={{width:"50%", display:"block", border:"1px solid gray"}}></img>
                      <div>
                        Figure above provides an additional example to illustrate the concept of probability sampling.
                      </div>
                      <div>
                      Probability sampling can be easily applied in many scenarios, such as the Pin1 system, which contains 10 Alanine residues and 15 Glutamicacid residues. 
                      If we set the compressing ratio as 3, the number of Alanine and Glutamic acid residues will be reduced to [10/3]=4 and [15/3]=5 respectively. 
                      </div>
                      </>}/>
                  </span>,
                },
                {
                  key: '3',
                  label: <Radio value={3} >Protein domain Sampling 
                  </Radio>,
                  extra: <span onClick={(e)=>{e.stopPropagation()}}>
                  <Drawer 
                      title="Protein domain Sampling" 
                      content={<>
                      <div>The protein domain sampling strategy leverages biological knowledge of the protein domains to present all the residues within a domain by a newly generated unit. 
                        Biologically, protein domains categorize proteins into fractions with specific functionality, such as binding a particular molecule or catalyzing a given reaction. 
                        The protein domains can be queried as annotations from the UniProt database. 
                        Figure below shows the concept of protein domain sampling. </div> 
                      <img src={domain_sampling} style={{width:"50%", display:"block", border:"1px solid gray"}}></img>
                      <div>
                       If this sampling method was choosed, users need define their protein domains based on their specific needs in Set Domains option.
                      </div>
                      </>}/>
                  </span>,
                },
              ]}
            />
      </Radio.Group>
    </Form.Item> 
    
    <Form.Item name='Name' label="Job Name" rules={[{ type: 'string',max: 50, }]} extra="user defined name"  >
      <Input onChange={(e) => setUserSubmitForm({ ...userSubmitForm, Name: e.target.value })} placeholder='optional'/>
    </Form.Item>
    <Form.Item name='Email' label="Email" rules={[{ type: 'email', }]}  extra="can remind you when the job is completed">
      <Input onChange={(e) => setUserSubmitForm({ ...userSubmitForm, Email: e.target.value })} placeholder='optional'/>
    </Form.Item>

    <Form.Item name="VisualThreshold" label= "Visualization Threshold" style={{}} rules={[{type:"float" }]} extra={<><span>threshold for interaction visualization</span> &nbsp;&nbsp;&nbsp;<VisualThresholdHelp/></>}>   
        <InputNumber style={{width:"30%"}} min={0.1} max={1.0} step={0.01} onChange={(e) => setUserSubmitForm({ ...userSubmitForm, VisualThreshold: e })} placeholder='0.6'/>
    </Form.Item>
    <Form.Item name="DistThreshold" label= "Distance Threshold"  rules={[{type:"number",min:1, max:50, }]} extra={<>ignore the interaction if residue distance between residues &gt; Distance Threshold &nbsp;&nbsp;&nbsp;<DistThresholdHelp/></>}>   
        <InputNumber style={{width:"30%"}} precision={0} onChange={(e) => setUserSubmitForm({ ...userSubmitForm, DistThreshold: e })} placeholder='12'/>
    </Form.Item>

    <Form.Item name="Domains" label="Set Domains"  onChange={()=>{setUserSubmitForm({...userSubmitForm, Domains:reduceDomains2String(controlledSubmitForm.getFieldValue('domain_infos'))});}}>
      <Form.List name="domain_infos" 
          rules={[{required:userSubmitForm.SampleStrategy==3},]}
      >
      {(fields, { add, remove }, {errors}) => (
          <>
          {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{display:"flex", alignItems:"baseline"}} >   
                <Form.Item {...restField} name={[name, 'domain_name']} style={{display:"inline-block", width:"30%"}} rules={[ { required: false, type:'string', max: 20, message: 'Missing domain name',},]} >
                  <Input placeholder="Domain name" />
                </Form.Item>
                <span style={{display:"inline-block", width:"3%",textAlign:"center"}}>: </span>
                <Form.Item {...restField} name={[name, 'domain_start']} style={{display:"inline-block", width:"30%"}} rules={[ { required: false, type:"number",  min:1, message: 'Missing start name',},
                    ({getFieldValue})=>({
                        validator(_,value){
                            var arr =getFieldValue('domain_infos')
                            if(proteinLength != 0 && proteinLength != undefined ){
                              if(value > proteinLength){
                                  return Promise.reject(new Error(`should less than protein length`))
                                }
                            }
                            if(name !== 0){
                                if(value <= arr[name-1]['domain_end']){
                                    return Promise.reject(new Error(`should greater last domain end`))
                                }
                            }
                            return Promise.resolve()
                        }
                    })          
                ]}>
                  <InputNumber placeholder="Start index" precision={0} style={{width:"100%"}}/>
                </Form.Item>
                <CaretRightOutlined  style={{display:"inline-block", width:"3%"}}/>
                <Form.Item {...restField} name={[name, 'domain_end']} style={{display:"inline-block", width:"30%"}} rules={[ { required: userSubmitForm.SampleStrategy==3,  min:2, type:"number",  message: 'Missing end name',},
                    ({getFieldValue})=>({
                        validator(_,value){
                          var arr =getFieldValue('domain_infos')
                          var start = arr[name]['domain_start']
                          if( start != undefined ){
                              if(value <= start){
                                  return Promise.reject(new Error(`should greater than start index `))
                              }
                          }
                          if(proteinLength != 0 && proteinLength != undefined ){
                              if(value > proteinLength){
                                  return Promise.reject(new Error(`should less than protein length`))
                              }
                          }
                          return Promise.resolve()
                        }
                    })
                ]}>
                  <InputNumber placeholder="End index" precision={0} style={{width:"100%"}}/>
                </Form.Item>
                <MinusCircleOutlined style={{display:"inline-block", width:"4%"}} onClick={()=>{remove(name);
                  // console.log(reduceDomains2String(controlledSubmitForm.getFieldValue('domain_infos')));
                  setUserSubmitForm({...userSubmitForm, Domains:reduceDomains2String(controlledSubmitForm.getFieldValue('domain_infos'))})}} />                        
              </div>
          ))}
          <Form.Item  extra={<><span>setting domains information can visualize interaction among domains</span> &nbsp;&nbsp;&nbsp;<DomainsHelp/></>}>
              <Button type="dashed" block icon={<PlusOutlined />} onClick={(e) => {add();}} > 
                Add domain 
              </Button>
              <Form.ErrorList errors={errors} />
          </Form.Item>
          </>
      )}
      </Form.List>
    </Form.Item>

    <Form.Item name="" label="Allosteric Path" > 
      <Form.Item name="SourceNode" style={{display:"inline-block", width:"50%"}} rules={[{type:"number", min:1, max:1000, },
              ()=>({
                  validator(_,value){
                      if(proteinLength != 0 && proteinLength != undefined ){
                          if(value > proteinLength){
                              return Promise.reject(new Error(`\'source\' should be less than protein length (${proteinLength})!`))
                          }
                      }
                      return Promise.resolve()
                  }
              })
          ]} 
      extra={<><span>start residue and end residue of allosteric path </span> &nbsp;&nbsp;&nbsp;<SourceTargteHelp/></> }>   
          <InputNumber onChange={(e) => setUserSubmitForm({ ...userSubmitForm, SourceNode: Number(e) })} style={{width:"100%"}} placeholder='source node' addonAfter="->"/>
      </Form.Item>
      <Form.Item name="TargetNode" style={{display:"inline-block", width:"50%"}} rules={[{type:"number", min:1, max:1000, },
          ()=>({
              validator(_,value){
                  if(proteinLength != 0 && proteinLength != undefined ){
                      if(value > proteinLength){
                          return Promise.reject(new Error(`\'target\' should be less than protein length (${proteinLength})!`))
                      }
                  }
                  return Promise.resolve()
              }
          })
      ]}>   
          <InputNumber onChange={(e) => setUserSubmitForm({ ...userSubmitForm, TargetNode: Number(e) })} style={{width:"100%"}} placeholder='target node' addonBefore="" addonAfter=""/>
      </Form.Item>
    </Form.Item>

    <Form.Item name="" label="Advanced Parameters" whitespace >
      <Collapse items={[
        {
          key: '1',
          label: 'Convert-Dataset Parameters',
          children: <>
            <Form.Item whitespace label="Split Interval" style={{marginBottom:0}}>
              <Form.Item name="TrainInterval" style={{display:"inline-block", width:"33%"}} rules={[{type:"number",min: 1, max: 1000, }]} extra="Train Interval" >   
                  <InputNumber  precision={0} onChange={(e) => setUserSubmitForm({ ...userSubmitForm, TrainInterval: Number(e) })} placeholder='train interval'  style={{width:"90%"}} addonAfter=""/>
              </Form.Item>
              <Form.Item name="ValidateInterval" style={{display:"inline-block", width:"33%"}} rules={[{type:"number", min: 1, max: 1000, }]} extra="Validate Interval" >   
                  <InputNumber  precision={0} onChange={(e) => setUserSubmitForm({ ...userSubmitForm, ValidateInterval: Number(e) })} placeholder='validate interval'  style={{width:"90%"}} addonAfter=""/>
              </Form.Item>
              <Form.Item name="TestInterval" style={{display:"inline-block", width:"33%"}} rules={[{type:"number", min: 1, max: 1000, }]} extra="Test Interval" >   
                  <InputNumber  precision={0} onChange={(e) => setUserSubmitForm({ ...userSubmitForm, TestInterval: Number(e) })} placeholder='test interval' style={{width:"90%"}} addonAfter=""/>
              </Form.Item>          
            </Form.Item>

            <Form.Item name="TimeStepSize" label="Timestep Size" 
              style={{width:"50%"}}
              dependencies={['TrainInterval','ValidateInterval','TestInterval']}
                rules={[{type:"number", min: 1, max: VALID_TRAJ_FRAMES, },
                ({getFieldValue})=>({
                    validator(_,value){
                        var interval = [getFieldValue('TrainInterval'),getFieldValue('TestInterval'),getFieldValue('ValidateInterval')]
                        interval.sort(function(a,b){
                            return a-b;
                        })
                        var min = interval[0]
                        var dic = {'Train Interval':getFieldValue('TrainInterval'),'Test Interval':getFieldValue('TestInterval'),'Validate Interval':getFieldValue('ValidateInterval')}
                        function findKey (value,compare = (a,b) => a===b){
                            return Object.keys(dic).find(k=>compare(dic[k],value))
                        }
                        var key = findKey(min)
                        if(proteinFrames!= undefined && proteinFrames !=undefined){
                            if(value*min < proteinFrames){
                                return Promise.reject(new Error(`Timestep size  multiply ${key} (${dic[key]}) should be greater than frames (${proteinFrames})!`))
                            }
                        }
                        return Promise.resolve()
                                
                    }
                })
            ]} 
              extra="Note: TimeStep Size * Interval >= trajectory frames">
                  <InputNumber placeholder='1~1000' onChange={(e) => {setUserSubmitForm({ ...userSubmitForm, TimeStepSize: e });}}  precision={0} style={{width:"100%"}}/>
            </Form.Item>

            <Form.Item name="" whitespace label="Sample Range">
              <Form.Item name="SampleStart" style={{display:"inline-block", width:"33%",marginBottom:0}} rules={[{type:"number", min: 1, max: VALID_TRAJ_FRAMES, }]} >   
                  <InputNumber onChange={(e) => setUserSubmitForm({ ...userSubmitForm, SampleStart: Number(e) })} precision={0} style={{width:"100%"}} placeholder='sample start' addonAfter="->"/>
              </Form.Item>
              <Form.Item name="SampleEnd" 
                  style={{display:"inline-block", width:"33%", marginBottom:0}}
                  dependencies={['SampleStart']}
                  rules={[{type:"number", min: 1, max: VALID_TRAJ_FRAMES, },
                  ({getFieldValue})=>({
                      validator(_,value){
                          var start =getFieldValue('Start')
                          if(start != undefined){
                              if(start >= value){
                                  return Promise.reject(new Error('\'start\' should be less than \'end\''))
                              }
                          }
                          if(proteinFrames != 0 && proteinFrames != undefined ){
                              if(value > proteinFrames){
                                  return Promise.reject(new Error(`\'end\' should be less than protein length (${proteinFrames})!`))
                              }
                          }
                          return Promise.resolve()
                      }
                  })
                  
              ]} >   
                  <InputNumber onChange={(e) => setUserSubmitForm({ ...userSubmitForm, SampleEnd: Number(e) })} precision={0} placeholder='sample end' style={{width:"100%"}} addonAfter=""/>
              </Form.Item>
            </Form.Item>
          </>,
          // extra: genExtra(),
        },
        {
          key: '2',
          label: 'Algorithm Parameters',
          children: <>
            <Card style={{ width: "99%",}}>
            <ConfigProvider theme={{components: { }, }}>
              <Form.Item name="Epochs" label="Epochs" rules={[{ type: 'number',min: 1, max: 500, }]} >
                  <Slider marks={{0:0,100:100, 200:200, 300:300, 400:400, 500:500,} }  max={500} onChange={(e) => {setUserSubmitForm({ ...userSubmitForm, Epochs: e })}}/>
              </Form.Item>
            </ConfigProvider>

            <Form.Item label="Learning Rate" name="Lr" rules={[{ type: 'float',min: 0.0001, max: 0.0050, }]}>
                <Slider marks={{0:0, 0.0010:0.0010, 0.0020:0.0020, 0.0030:0.0030, 0.0040:0.0040, 0.0050:0.0050,} }  
                max={0.0050} step={0.0001} 
                onChange={(e) => {setUserSubmitForm({ ...userSubmitForm, Lr: e })}}/>
            </Form.Item>

            <Form.Item className='lrd' name="LrDecay" label="Learning Rate Decay"  rules={[{ type: 'number',min: 1, max: 500, }]} >
                <Slider  marks={{0:0,100:100, 200:200, 300:300, 400:400, 500:500,} }  max={500}  onChange={(e) => {setUserSubmitForm({ ...userSubmitForm, LrDecay: e })}}/>
            </Form.Item>

            <Form.Item whitespace style={{marginBottom:0}}>
              <Form.Item  label="Gamma" name="Gamma" rules={[{ type: 'number',min: 0.1, max: 1, }]} style={{display:"inline-block", width:"33%", marginBottom:0}}>
                  <InputNumber  placeholder='0.1~1' onChange={(e) => {setUserSubmitForm({ ...userSubmitForm, Gamma: e })}} step={0.1} style={{width:"90%"}}/>
              </Form.Item>
              <Form.Item  label="Seed" name="Seed" rules={[{ type: 'number',min: 0, max: 100, }]} style={{display:"inline-block", width:"33%", marginBottom:0}}>
                  <InputNumber  placeholder='0~100' precision={0} onChange={(e) => {setUserSubmitForm({ ...userSubmitForm, Seed: e })}} style={{width:"90%"}}/>
              </Form.Item>
              <Form.Item  label="Var" name="Var" rules={[{ type: 'float',min: 1e-5, max: 1e-4, }]} style={{display:"inline-block", width:"33%", marginBottom:0}}>
                  <InputNumber  placeholder='0.00001~0.0001' onChange={(e) => {setUserSubmitForm({ ...userSubmitForm, Var: e })}} step={1e-5} style={{width:"90%"}}/>
              </Form.Item>
            </Form.Item>
            </Card>
              <Row style={{margin:"1vh 0"}}>
              <Col span={12} >
                <Card title={<div style={{textAlign:"center",width:"100%"}}>Encoder</div> } style={{ width: "99%",}}>
                  <Form.Item name="Encoder" >
                      <Radio.Group onChange={(e) => setUserSubmitForm({ ...userSubmitForm, Encoder: e.target.value })} >
                      <Radio value="mlp">MLP</Radio>
                      <Radio value="cnn">CNN</Radio>
                      </Radio.Group>
                  </Form.Item>
                  <Form.Item name="EncoderHidden" label="Hidden" className='hidden' rules={[{ type: 'number',min: 1, max: 1000, }]}>
                      <Slider  marks={{0:0,200:200, 400:400, 600:600, 800:800, 1000:1000,} }  max={1000}  onChange={(e) => {setUserSubmitForm({ ...userSubmitForm,EncoderHidden: e })}}/>
                  </Form.Item>
                  <Form.Item name="EncoderDropout" label="Dropout" className='dropout' rules={[{ type: 'number',min: 0, max: 1.0, }]}>
                      <Slider  marks={{0.0:0.0,0.10:0.10, 0.20:0.20, 0.30:0.30, 0.40:0.40, 0.50:0.50,} } step={0.01} max={0.50}  onChange={(e) => {setUserSubmitForm({ ...userSubmitForm,EncoderDropout: e })}}/>
                  </Form.Item>
                </Card>
              </Col>
              <Col span={12} >
                <Card title={<div style={{textAlign:"center",width:"100%"}}>Decoder</div> } style={{ width: "99%",}}>
                    <Form.Item name="Decoder" className='cls'>
                        <Radio.Group onChange={(e) => setUserSubmitForm({ ...userSubmitForm, Decoder: e.target.value })} >
                        <Radio value="rnn">RNN</Radio>
                        <Radio value="mlp">MLP</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="DecoderHidden" label="Hidden" className='hidden' rules={[{ type: 'number',min: 1, max: 1000, }]}>
                        <Slider  marks={{0:0,200:200, 400:400, 600:600, 800:800, 1000:1000,} }  max={1000}  onChange={(e) => {setUserSubmitForm({ ...userSubmitForm,DecoderHidden: e })}}/>
                    </Form.Item>
                    <Form.Item name="DecoderDropout" label="Dropout" className='dropout' rules={[{ type: 'number',min: 0, max: 1.0, }]}>
                        <Slider  marks={{0.0:0.0,0.10:0.10, 0.20:0.20, 0.30:0.30, 0.40:0.40, 0.50:0.50,} } step={0.01} max={0.50}  onChange={(e) => {setUserSubmitForm({ ...userSubmitForm,DecoderDropout: e })}}/>
                    </Form.Item>
                </Card>
              </Col>
            </Row>
          </>,
          // extra: genExtra(),
        },
      ]} defaultActiveKey={[]} onChange={()=>{}} />
    </Form.Item>


    <Form.Item name="" label="Other Mainstream Methods">
      <Collapse items={[
        {
          key: '1',
          label: <><Switch checked={userSubmitForm.PRS} onChange={(e)=>{setUserSubmitForm({...userSubmitForm, PRS:e})}} /> PRS: perturbation response scanning </>,
          children: <>
            
            <Form.Item name="PRSNumPertubations" label="Number of pertubations" rules={[{type:"number", min: 1, max: 1000, }]} extra="number of anisotropic pertubations" >   
                <InputNumber   onChange={(e) => setUserSubmitForm({ ...userSubmitForm, PRSNumPertubations: e })} />
            </Form.Item>
            <Form.Item name="PRSHessianMethod" label="Hessian Method" extra="the method to calculate hessian matrix of protein.">
                <Radio.Group onChange={(e) => setUserSubmitForm({ ...userSubmitForm, PRSHessianMethod: e.target.value })} >
                    <Radio value={0}>Original Hessian</Radio>
                    <Radio value={1}>Shringkage Covariance</Radio>
                    <Radio value={2}>MDTASK Covariance</Radio>
                </Radio.Group>
            </Form.Item> 
            <Form.Item name="PRSDistanceThreshold" label="Distance Threshold" rules={[{type:"number", min: 1, max: 1000, }]} extra="distance threshold to generate covariance matrix">   
                <InputNumber   onChange={(e) => setUserSubmitForm({ ...userSubmitForm, PRSDistanceThreshold: e })} />
            </Form.Item>
            <Form.Item name="PRSCosineThreshold" label="Cosine Threshold" rules={[{type:"number", min: 0, max: 1, }]} style={{marginBottom:0}} extra="cosine threshold of angle of two displacement of two residues">   
                <InputNumber   onChange={(e) => setUserSubmitForm({ ...userSubmitForm, PRSCosineThreshold: e })} />
            </Form.Item>
            
          </>,
          extra: <span onClick={(e)=>{e.stopPropagation()}}>
          <Drawer 
            title="PRS was implemented according to https://pubs.acs.org/doi/10.1021/acs.jpcb.7b11971:" 
            content={<><div>Campitelli P, Guo J, Zhou HX, Ozkan SB. Hinge-Shift Mechanism Modulates Allosteric Regulations in Human Pin1. J Phys Chem B. 2018 May 31;122(21):5623-5629. doi: 10.1021/acs.jpcb.7b11971. Epub 2018 Feb 7. PMID: 29361231; PMCID: PMC5980714.</div> 
            </>}
            />
        </span>,
        },
        {
          key: '2',
          label: <><Switch checked={userSubmitForm.EHH}  onChange={(e)=>{setUserSubmitForm({...userSubmitForm, EHH:e})}} /> EHH: effctive harmonic Hessian </>,
          children: <>
            <Form.Item name="EHHCovarianceMethod" label="Covariance Method" extra="the method to generate the input covariance for hENM">
                <Radio.Group  onChange={(e) => setUserSubmitForm({ ...userSubmitForm, EHHCovarianceMethod: e.target.value })} >
                    <Radio value={1}>Shringkage</Radio>
                    <Radio value={2}>MDTASK</Radio>
                </Radio.Group>
            </Form.Item>                   
            <Form.Item name="EHHMaxIterations" label="Max Iterations" rules={[{type:"number", min: 1, max: 1000, }]} extra="max iterations of calculating harmonic hessian">   
                <InputNumber   onChange={(e) => setUserSubmitForm({ ...userSubmitForm, EHHMaxIterations: e })} />
            </Form.Item>
            <Form.Item name="EHHAlpha" label="Alpha" rules={[{type:"number", min: 0, max: 20, }]} extra="coefficient for iterations">      
                <InputNumber   onChange={(e) => setUserSubmitForm({ ...userSubmitForm, EHHAlpha: e })} />
            </Form.Item> 
            <Form.Item name="EHHkBT" label="kBT" rules={[{type:"float", min: 0, max: 1, }]} extra="energy coefficient">   
                <InputNumber   onChange={(e) => setUserSubmitForm({ ...userSubmitForm, EHHkBT: e })} />   
            </Form.Item>
            <Form.Item name="EHHThreshold" label="Threshold" rules={[{type:"float", min: 0, max: 1, }]} extra="threshold for iterations">   
                <InputNumber   onChange={(e) => setUserSubmitForm({ ...userSubmitForm, EHHThreshold: e })} />   
            </Form.Item>
            <Form.Item name="EHHDistanceCutoff" label="Distance Cutoff" rules={[{type:"number", min: 0, max: 1000, }]} style={{marginBottom:0}} extra="distance cutoff for two residues" >   
                <InputNumber onChange={(e) => setUserSubmitForm({ ...userSubmitForm, EHHDistanceCutoff: e })} />
            </Form.Item>          
          </>,
          extra: <span onClick={(e)=>{e.stopPropagation()}}>
          <Drawer 
            title="EHH was implemented according to https://pubs.acs.org/doi/full/10.1021/ci400044m:" 
            content={<div>Lake PT, Davidson RB, Klem H, Hocky GM, McCullagh M. Residue-Level Allostery Propagates through the Effective Coarse-Grained Hessian. J Chem Theory Comput. 2020 May 12;16(5):3385-3395. doi: 10.1021/acs.jctc.9b01149. Epub 2020 Apr 17. PMID: 32251581.</div> }/>
        </span>,
        },
        {
          key: '3',
          label: <> <Switch checked={userSubmitForm.CNA} onChange={(e)=>{setUserSubmitForm({...userSubmitForm, CNA:e})}} /> CNA: constraint network analysis</>,
          children: <>
            <Form.Item name="CNAStepSize" label="Step Size" extra="sampling steps for all-atom trajecory" rules={[{type:"number", min: 1, max: 1000, },
              ()=>({
                validator(_,value){
                    if(aaTrajFrames != 0 && aaTrajFrames != undefined ){
                      if(value > aaTrajFrames){
                          return Promise.reject(new Error(`should less than trajectory frames`))
                        }
                    }
                    return Promise.resolve()
                }
              })   
            ]} >   
                <InputNumber onChange={(e) => setUserSubmitForm({ ...userSubmitForm, CNAStepSize: e })} />
            </Form.Item>                   
            <Form.Item name="AaTrajPDBPath" label="Upload all-atoms trajectory" extra={<>in PDB format <a href={'/api/nrimd/download/download_aatraj/'}>example</a></>} rules={[{ required: userSubmitForm.Example?false:userSubmitForm.CNA },]} style={{marginBottom:0}}>
                <Upload {...AaTrajProps} fileList={aatrajFileList}> 
                  <Button icon={<UploadOutlined />}>upload</Button>
                </Upload>
            </Form.Item>          
          </>,
          extra: <span onClick={(e)=>{e.stopPropagation()}}>
            <Drawer 
              title="CNA was implemented according to https://cpclab.uni-duesseldorf.de/cna/main.php: " 
              content={<div>
              Pfleger C, Rathi PC, Klein DL, Radestock S, Gohlke H. Constraint Network Analysis (CNA): a Python software package for efficiently linking biomacromolecular structure, flexibility, (thermo-)stability, and function. J Chem Inf Model. 2013 Apr 22;53(4):1007-15. doi: 10.1021/ci400044m. Epub 2013 Apr 8. PMID: 23517329.
              </div>}
              />
          </span>,
        },
      ]} defaultActiveKey={[]} onChange={()=>{}} expandIconPosition={'end'} style={{marginTop:"1vh"}}/>
    </Form.Item>


    <Form.Item wrapperCol={{ offset: 14, span: 8,}} >
      <Button type="primary" htmlType="submit" style={{backgroundColor:font_color, fontWeight:"bold"}}> Submit </Button>
    </Form.Item>
  </Form>
  </ConfigProvider></>
  return <>
    <div>
      {needSample?<SampleTip/>:''}
      {ifSubmitForm?submitForm:SubmitSuccessfulFailed()} 
      <SubmittingLogo ifSubmitting={ifSubmitting}/>
    </div> 
  </>
};
export default Submit;


