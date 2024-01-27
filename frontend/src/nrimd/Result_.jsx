
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams, Link,  } from 'react-router-dom'
import { CheckApi, redomainNriApi, reresNriApi, recovNriApi, repathNriApi,  repathPrsApi, repathEhhApi, repathCnaApi } from './requests/api'
// import '../assets/lesses/result.less'
import { Button, Modal, Form, Input, ColorPicker, InputNumber, message, Select, ConfigProvider, Collapse, theme, Upload, Table, Divider, Spin, Tag, Space, Radio, Tooltip, Typography, Col, Row, Checkbox, Card } from 'antd';
import { DownloadOutlined, CloseOutlined, UploadOutlined, HddOutlined, CaretRightOutlined, SyncOutlined, PlusOutlined, MinusCircleOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Status from './components/result_components/Status'; 
import LoadingResultLogo from './components/result_components/LoadingResultLogo';
import PV from './components/result_components/PV.jsx'
const { Title } = Typography; 
const content_background_color =  "#edeff7"
const font_color = "#112264"
const {Option} = Select


const Drawer = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Modal title={props.title} footer={null} open={isModalOpen} closable={false} okText={false} cancelText={false} width={1000}>
        <div>
            {props.content}
        </div> 
        <div style={{textAlign:"right"}}><Button type="primary" onClick={()=>setIsModalOpen(false)}>OK</Button></div>
      </Modal>
    </>
  );
}



///////////////////////////
//upload structure PDB
///////////////////////////
const UploadStrucPDB = (props) => {
  const [strucFileList, setStrucFileList] = useState([]);
  const strucHandleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        props.setResults({...props.results,'StrucPDBPath':file.response.StrucPDBPath})
      }
      return file;
    });
    setStrucFileList(newFileList);
  };
  const strucProps={action:'/api/submit/upload_strucpdb/',onChange:strucHandleChange,multiple:false}

  return (
    <>
    <Form name="complex-form" labelCol={{span: 6,}} wrapperCol={{span: 18,}}>
          <Form.Item name="StrucFile" label="PDB File" extra="optional, upload protein structure pdb file (include all atoms) can visualize long-range allosteric interactions in protein " >
            <Upload {...strucProps} fileList={strucFileList}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
    </Form>
    <div style={{textAlign:'center'}}><Button type="primary" onClick={()=>{props.setIfStruc(true)}} icon={<CloseOutlined />}>Cancel</Button></div>
    </>
  );
};

///////////////////////////
//Change Residue
///////////////////////////
const Residue = (props)=>{
  const navigate = useNavigate()
  const [resForm] = Form.useForm()
  const [resLoading,setResLoading] = useState(false);
  useEffect(()=>{
    if(props.results.data.nri.VisualThreshold !== undefined){
        resForm.setFieldsValue({
          VisualThreshold: props.results.data.nri.VisualThreshold
        })
    }
  },[])
  var onFinish = async (values) => {
    setResLoading(true)
    const VisualThreshold = values.VisualThreshold
    const JobID = props.id
    const req={JobID, VisualThreshold}
    try{
      const res = await reresNriApi(req)
      props.setResults({...props.results, data:{...props.results.data, nri:{...props.results.data.nri, res:res.img, VisualThreshold:VisualThreshold}}})
      setResLoading(false)
    } catch (error) {
      navigate('/error')
    }
  }
  return <>
    <div style={{textAlign:"center",}}>
    {
      resLoading
      ?
      <Spin size="large" style={{padding:"33.1%"}}tip="Loading..."/>
      :
      <img style={{width:'100%'}} src={`data:image/png;base64,${props.results.data.nri.res}`} alt=""/>  
    }
    </div>
    <ConfigProvider theme={{components: { Form: {itemMarginBottom:"0vh", }, Button:{defaultBg:content_background_color}}, }}>
    <Card style={{width:"90%", marginTop:"1vh", border:"1px solid grey", backgroundColor:"#f2f4f5"}}>
      <Form name="visual form" onFinish={onFinish}  form={resForm} >
        <Form.Item name="VisualThreshold" className="VisualThreshold" label="Visualization Threshold"  rules={[{type:"number", max:1, min:0.1, message:'Must Between 0 and 1'}, {required:true, message:'Please input!',}]} 
            style={{marginRight:"10%", width:"70%", display:"inline-block"}}>   
            <InputNumber placeholder='0.6' />
        </Form.Item>
        <Form.Item style={{display:"inline-block"}} >
          <Button type="primary" htmlType="submit" style={{backgroundColor:font_color, fontWeight:"bold"}}>Change </Button>
        </Form.Item>
      </Form>
    </Card>
    </ConfigProvider>
  </>
}

///////////////////////////
//Change Covariance
///////////////////////////
const Covariance = (props)=>{
  const navigate = useNavigate()
  const [covForm] = Form.useForm()
  const [covLoading,setCovLoading] = useState(false);
  useEffect(()=>{
    if(props.results.data.nri.DistThreshold !== undefined){
        covForm.setFieldsValue({
          DistThreshold: props.results.data.nri.DistThreshold
        })
    }
  },[props.results.data.nri.DistThreshold])
  var onFinish = async (values) => {
    setCovLoading(true)
    const DistThreshold = values.DistThreshold
    const JobID = props.id
    const req={JobID, DistThreshold}
    try{
      const res = await recovNriApi(req)
      props.setResults({...props.results, data:{...props.results.data,"nri":{...props.results.data.nri, cov:res.img, DistThreshold:DistThreshold}}})
      setCovLoading(false)
    } catch (error) {
      navigate('/error')
    }
  }

  return <>
    <div style={{textAlign:"center",}}>
      {
        covLoading
        ?
        <Spin size="large" style={{padding:"33.1%"}}tip="Loading..."/>
        :
        <img style={{width:'100%'}} src={`data:image/png;base64,${props.results.data.nri.cov}`} alt=""/>  
      }
    </div>
    <ConfigProvider theme={{components: { Form: {itemMarginBottom:"0vh", }, Button:{defaultBg:content_background_color}}, }}>
    <Card style={{width:"90%", marginTop:"1vh", border:"1px solid grey", backgroundColor:"#f2f4f5"}}>
      <Form name="dist form" onFinish={onFinish}  form={covForm} >
        <Form.Item name="DistThreshold" className="DistThreshold" label="Distance Threshold"  rules={[{type:"number", min:0, message:'Must greater than 0'}, {required:true, message:'Please input!',}]} 
            style={{marginRight:"10%", width:"70%", display:"inline-block"}}>   
            <InputNumber placeholder='12' />
        </Form.Item>
        <Form.Item style={{display:"inline-block"}}>
          <Button type="primary" htmlType="submit" style={{backgroundColor:font_color, fontWeight:"bold"}}>Change</Button>
        </Form.Item>
      </Form>
    </Card>
    </ConfigProvider>
  </>
}

///////////////////////////
//Change Domain
///////////////////////////
const Domain = (props)=>{
  const navigate = useNavigate()
  const [domainForm] = Form.useForm()
  const [domainLoading,setDomainLoading] = useState();
  var onFinish = async (values) => {
    setDomainLoading(true)
    const arr = values.domain_infos
    const Domains = arr.map(obj => obj.domain_name+'_'+(obj.domain_start)+'_'+(obj.domain_end)).join(',')
    const DoaminVisualThreshold = values.DoaminVisualThreshold
    const JobID = props.id
    const req={JobID, Domains, DoaminVisualThreshold}
    try{
      const res = await redomainNriApi(req)
      props.setResults({...props.results, data:{...props.results.data, nri:{...props.results.data.nri, Domains:Domains, DoaminVisualThreshold:DoaminVisualThreshold, domain:res.img}}})
      setDomainLoading(false)
    } catch (error) {
      navigate('/error')
    }
  };

  useEffect(()=>{
    console.log(props.results.data.nri.Domains);
    if(props.results.data.nri.Domains !== undefined){
      if(props.results.data.nri.Domains !== ','){  
        let domain_infos = props.results.data.nri.Domains.split(',').map(dm_s_e => {return {'domain_name':dm_s_e.split('_')[0],'domain_start':Number(dm_s_e.split('_')[1]),'domain_end':Number(dm_s_e.split('_')[2])}})
        domainForm.setFieldsValue({
          domain_infos: domain_infos
        })
       }
    }
  },[props.results.data.nri.Domains])

  useEffect(()=>{
    if(props.results.data.nri.DomainVisualThreshold !== undefined){
        domainForm.setFieldsValue({
          DoaminVisualThreshold: props.results.data.nri.DomainVisualThreshold
        })
    }
  },[props.results.data.nri.DomainVisualThreshold])

  return <>
    <Row>
      <Col span={12}>
        <div style={{textAlign:"center",}}>
          {
            domainLoading
            ?
            <Spin size="large" style={{padding:"33.1%"}}tip="Loading..."/>
            :
            <img style={{width:'100%'}} src={`data:image/png;base64,${props.results.data.nri.domain}`} alt=""/>  
          }
          
        </div>
      </Col>
      <Col span={12}>
        <ConfigProvider theme={{components: { Form: {itemMarginBottom:"1vh", }, Button:{defaultBg:content_background_color}}, }}>
          <Card style={{width:"90%", marginTop:"1vh", border:"1px solid grey", backgroundColor:"#f2f4f5"}}>
            <Form name="domain form" onFinish={onFinish} autoComplete="off" form={domainForm}>
              <Form.Item name="DoaminVisualThreshold" label= "Visualization Threshold" rules={[{type:"number",required:true }]} >   
                  <InputNumber placeholder='0.6'/>
              </Form.Item>
              <div style={{marginBottom:"1vh"}}>Set Domains: </div>
              <Form.Item >
                <Form.List name="domain_infos" >
                  {(fields, { add, remove }, {errors}) => (
                      <>
                      {fields.map(({ key, name, ...restField }) => (
                          <div key={key} style={{display:"flex", alignItems:"baseline"}} >   
                            <Form.Item {...restField} name={[name, 'domain_name']} style={{display:"inline-block", width:"30%"}} rules={[ { required: true, type:'string', max: 20, message: 'Missing domain name',},]} >
                              <Input placeholder="Domain name" />
                            </Form.Item>
                            <span style={{display:"inline-block", width:"3%",textAlign:"center"}}>: </span>
                            <Form.Item {...restField} name={[name, 'domain_start']} style={{display:"inline-block", width:"30%"}} rules={[ { required: true, type:"number",  min:1, message: 'Missing start name',},
                                ({getFieldValue})=>({
                                    validator(_,value){
                                        var arr =getFieldValue('domain_infos')
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
                            <Form.Item {...restField} name={[name, 'domain_end']} style={{display:"inline-block", width:"30%"}} rules={[ { required: true,  message: 'Missing end name',},
                                ({getFieldValue})=>({
                                    validator(_,value){
                                      var arr =getFieldValue('domain_infos')
                                      var start = arr[name]['domain_start']
                                      if( start != undefined ){
                                          if(value <= start){
                                              return Promise.reject(new Error(`should greater than start index `))
                                          }
                                      }
                                      return Promise.resolve()
                                    }
                                })
                            ]}>
                              <InputNumber placeholder="End index" precision={0} style={{width:"100%"}}/>
                            </Form.Item>
                            <MinusCircleOutlined style={{display:"inline-block", width:"4%"}} onClick={()=>{remove(name);}} />                       
                          </div>
                      ))}
                      <Form.Item  extra={<><span>setting domains information can visualize interaction among domains</span> </>}>
                          <Button type="dashed" block icon={<PlusOutlined />} onClick={(e) => {add();}} > 
                            Add domain 
                          </Button>
                          <Form.ErrorList errors={errors} />
                      </Form.Item>
                      
                      </>
                  )}
                </Form.List>
              </Form.Item>
              <Form.Item style={{textAlign:"center"}}>
                <Button type="primary" htmlType="submit" style={{backgroundColor:font_color, fontWeight:"bold"}}>Change </Button>
              </Form.Item>
            </Form>
          </Card>
        </ConfigProvider>
      </Col>
    </Row>
  </>
}

///////////////////////////
//Change NRI path
///////////////////////////
const NriPath = (props)=>{
  const navigate = useNavigate()
  const [nripathForm] = Form.useForm()
  const [pathsLoading,setPathsLoading] = useState(false)
  const [ifStruc,setIfStruc] = useState();
  const [pvPaths,setPvPaths] = useState();

  useEffect(()=>{
    console.log(props.results.data.nri.path, props.results.data.nri.SourceNode, props.results.data.nri.TargetNode);
    if(props.results.data.nri.path.length==0 || props.results.data.nri.path==undefined){
      nripathForm.setFieldsValue({
        PathDistThreshold: props.results.data.nri.PathDistThreshold,
      })
    }else{
      nripathForm.setFieldsValue({
        PathDistThreshold: props.results.data.nri.PathDistThreshold,
        SourceNode: props.results.data.nri.SourceNode,
        TargetNode: props.results.data.nri.TargetNode,
      })
    }
  },[props.results.data.nri.SourceNode, props.results.data.nri.TargetNode, props.results.data.nri.PathDistThreshold])
  useEffect(()=>{
    if(props.results.data.nri.path.length >=1){
      setPvPaths([Paths2List(props.results.data.nri.path)[0]])
    }
  },[])

  useEffect(()=>{
    if(props.results.StrucPDBPath !== undefined && props.results.StrucPDBPath !== null){
      setIfStruc(true)
    }else{
      setIfStruc(false)
    }
  },[props.results.StrucPDBPath])

  var onFinish = async (values) => {
    setPathsLoading(true)
    const PathDistThreshold = values.PathDistThreshold
    var SourceNode = values.SourceNode
    var TargetNode = values.TargetNode
    const JobID = props.id
    const req={JobID, PathDistThreshold, SourceNode, TargetNode}
    try {
    const res = await repathNriApi(req)
    props.setResults({...props.results, data:{...props.results.data, nri:{...props.results.data.nri, path:res.path, SourceNode:SourceNode, TargetNode:TargetNode, PathDistThreshold:PathDistThreshold}}})
    setPathsLoading(false)
    } catch (error) {
      navigate('/error')
    }
  };


  const cm = [{title:'Path Name',dataIndex:'pathname', width: "15%", },
              {title:'Path',dataIndex:'path',width:"65%"},
              {title:'Probability',dataIndex:'probability',width:"20%"},
            ]

  const Paths2List = (paths) =>{
    if(paths!==undefined){
      var paths_arr = new Array()
      for(let i=0; i< paths.length; i++){
        var nodes = paths[i].path.split('->')
        paths_arr.push(nodes.map(Number).filter(Number.isInteger))
      }
      return paths_arr
    }
  }

  const LabelsString2List = (labelString) =>{
    if(labelString!==undefined){
      const arr = labelString.split("_").map(Number);
      return arr
    }
  }
  const Int2List = (size) =>{
    const array = [];
    for (let i = 1; i <= size; i++) {
      array.push(i);
    }
    return array
  }

  const ListPath = (nripath, sample) => {
    return ( <div>
      {

        <Table loading={pathsLoading} dataSource={nripath} locale={{emptyText:
            (nripath == undefined || nripath.length == 0 ) && sample
            ?
            <div style={{color:'red'}}>
              <div>Because the protein was sampled, original allosteric start residue or end residue is not in the sampled residues.</div>
              <div>You can reset allosteric source residue and target residue in the above form.</div>
            </div>
            :      
            ''
        }}rowSelection={{type: "checkbox",  defaultSelectedRowKeys:[1], 
        onChange: (selectedRowKeys, selectedRows) => {
          var arr = new Array()
          for(let i=0;i<selectedRowKeys.length;i++){
            arr.push(nripath[selectedRowKeys[i]-1])
          }
          setPvPaths(
            Paths2List(arr)
          )
        },
        fixed: false, }} columns={cm}  bordered pagination={false} size="middle"/>
      }
      </div>);
  };   
  return <>
    <ConfigProvider theme={{components: { Form: {itemMarginBottom:"1vh", }, Button:{defaultBg:content_background_color}}, }}>
      <Card style={{width:"90%", marginTop:"1vh", border:"1px solid grey", backgroundColor:"#f2f4f5"}}>
        <Form name="nri path form" onFinish={onFinish} wrapperCol={{offset:0, span: 24}}  form={nripathForm}>
          <Form.Item name="PathDistThreshold" label="Distance Threshold" rules={[{type:"number",required:true},
          ]} style={{display:'inline-block', marginRight:"5%"}} >   
              <InputNumber placeholder='>0'/>
          </Form.Item>
          {/* <Form.Item name="SourceNode" label="Allosteric path" rules={[{required: true, },
            ()=>({
              validator(_,value){
                  if(props.results.NumResidues != 0 && props.results.NumResidues != undefined ){
                      if(value > props.results.NumResidues){
                          return Promise.reject(new Error(`\'SourceNode\' should < protein length(${props.results.NumResidues}) !`))
                      }
                  }
                  return Promise.resolve()
              }
            })          
          
          ]} style={{display:'inline-block'}}>
            <InputNumber placeholder="Source residue" addonAfter="->"/>  
          </Form.Item>  */}
          <Form.Item name="SourceNode" label="Allosteric path" style={{display:'inline-block', width:"30%"}} rules={[ { required: true},]} extra="source residue">
              <Select placeholder="source"  style={{width:"100%"}}>
                {
                  props.results.data.nri.Sample ?
                  <>{LabelsString2List(props.results.data.nri.SampleSerials).map((item, index) =>  <Option value={item}>{item}</Option>)}</>
                  :
                  <>{Int2List(props.results.NumResidues).map((item, index) =>  <Option value={item}>{item}</Option>)}</>
                }
              </Select>
            </Form.Item>
          {/* <Form.Item name="TargetNode" rules={[{required: true, }, 
            ()=>({
              validator(_,value){
                  if(props.results.NumResidues != 0 && props.results.NumResidues != undefined ){
                      if(value > props.results.NumResidues){
                          return Promise.reject(new Error(`\'Target\' should ≤ protein length(${props.results.NumResidues}) !`))
                      }
                  }
                  return Promise.resolve()
              }
            })               
          ]} style={{display:'inline-block', width:"20%"}}>
            <InputNumber placeholder="Target residue" addonAfter="" style={{width:"100%"}} />
          </Form.Item> */}
          <Form.Item style={{display:'inline-block', width:"2%", textAlign:"center"}} >-&gt;</Form.Item>
          <Form.Item name="TargetNode" style={{display:'inline-block', width:"23%"}} rules={[ { required: true},]} extra="target residue">
              <Select placeholder="target"  style={{width:"100%"}}>
                {
                  props.results.data.nri.Sample ?
                  <>{LabelsString2List(props.results.data.nri.SampleSerials).map((item, index) =>  <Option value={item}>{item}</Option>)}</>
                  :
                  <>{Int2List(props.results.NumResidues).map((item, index) =>  <Option value={item}>{item}</Option>)}</>
                }
              </Select>
            </Form.Item>
          <Form.Item style={{textAlign:"center", display:"inline-block", marginLeft:"5%"}}>
            <Button type="primary" htmlType="submit" style={{backgroundColor:font_color, fontWeight:"bold"}}>Change </Button>
          </Form.Item>
        </Form>
      </Card>
    </ConfigProvider>
    <Row style={{marginTop:"2vh"}}>
      <Col span={12}>
        <div style={{}}>
          {
            ifStruc
            ?
            <PV setIfStruc={setIfStruc} pvPaths={pvPaths} StrucPDBPath={props.results.StrucPDBPath} method="nri"/>
            :
            <div style={{height:'50vh',padding:"10%",border:"2px dashed lightblue"}}><UploadStrucPDB results={props.results} setResults={props.setResults} setIfStruc={setIfStruc}/></div>
          }
        </div>
      </Col>
      <Col span={12}>
        <div style={{height:"50vh", marginLeft:"1%"}}>{ListPath(props.results.data.nri.path, props.results.data.nri.Sample)}</div>
      </Col>
    </Row>
  </>
}

///////////////////////////
//Change PRS path
///////////////////////////
const PrsPath = (props)=>{
  const navigate = useNavigate()
  const [pathsLoading,setPathsLoading] = useState(false)
  const [prspathForm] = Form.useForm()
  const [pvPaths,setPvPaths] = useState();
  const [ifStruc,setIfStruc] = useState();

  useEffect(()=>{
    if(props.results.data.prs !== undefined){
      prspathForm.setFieldsValue({
          DistThreshold: props.results.data.prs.DistThreshold,
          PRSSourceNode: props.results.data.prs.PRSSourceNode,
          PRSTargetNode: props.results.data.prs.PRSTargetNode,
          NumPertubation: props.results.data.prs.NumPertubation,
          CosineThreshold: props.results.data.prs.CosineThreshold,
        })
    }
  },[props.results.data.prs])

  useEffect(()=>{
    if(props.results.data.prs.path.length >=1){
      setPvPaths([Paths2List(props.results.data.prs.path)[0]])
    }
  },[])


  useEffect(()=>{
    if(props.results.StrucPDBPath !== undefined && props.results.StrucPDBPath !== null){
      setIfStruc(true)
    }else{
      setIfStruc(false)
    }
  },[props.results.StrucPDBPath])

  var onFinish = async (values) => {
    setPathsLoading(true)
    var DistThreshold = values.DistThreshold
    var PRSSourceNode = values.PRSSourceNode
    var PRSTargetNode = values.PRSTargetNode
    var NumPertubation = values.NumPertubation
    var CosineThreshold = values.CosineThreshold
    const JobID = props.id
    const req = {JobID, DistThreshold, PRSSourceNode, PRSTargetNode, NumPertubation, CosineThreshold}
    try{
      const res = await repathPrsApi(req)
      props.setResults({...props.results, data:{...props.results.data, prs:{...props.results.data.prs, path:res.path, DistThreshold:DistThreshold, PRSSourceNode:PRSSourceNode, PRSTargetNode:PRSTargetNode, NumPertubation:NumPertubation, CosineThreshold:CosineThreshold}}})
      setPathsLoading(false)
    } catch (error) {
      navigate('/error')
    }
  };
  const cm = [{title:'Path Name', dataIndex:'pathname', width: "15%"},
              {title:'Path', dataIndex:'path', width:"65%"},
              // {title:'Probability', dataIndex:'probability', width:"20%"},
            ]

  const Paths2List = (paths) =>{
    if(paths!==undefined){
      var paths_arr = new Array()
      for(let i=0; i< paths.length; i++){
        var nodes = paths[i].path.split('->')
        paths_arr.push(nodes.map(Number).filter(Number.isInteger))
      }
      return paths_arr
    }

  }
  const ListPath = (prspath) => {
    return ( <div>
      <Table loading={pathsLoading} dataSource={prspath} rowSelection={{type: "checkbox",  defaultSelectedRowKeys:[1], 
        onChange: (selectedRowKeys, selectedRows) => {
          var arr = new Array()
          for(let i=0;i<selectedRowKeys.length;i++){
            arr.push(prspath[selectedRowKeys[i]-1])
          }
          setPvPaths(
            Paths2List(arr)
          )
        },
      fixed:false}} columns={cm}  bordered pagination={false} size="middle"/>
      </div>);
  };
  return <>
    <ConfigProvider theme={{components: { Form: {itemMarginBottom:"1vh", }, Button:{defaultBg:content_background_color}}, }}>
      <Card style={{width:"100%", marginTop:"1vh", border:"1px solid grey", backgroundColor:"#f2f4f5"}}>
        <Form name="prs path form" onFinish={onFinish} wrapperCol={{offset:0, span: 24}}  form={prspathForm}>
          <Form.Item name="DistThreshold" label="Distance Threshold" rules={[{type:"number",required:true}]} style={{display:'inline-block', marginRight:"5%"}} >   
              <InputNumber placeholder='>0'/>
          </Form.Item>
          <Form.Item name="NumPertubation" label="Number of Pertubations" rules={[{required: true, }, ]} style={{display:'inline-block', marginRight:"5%"}}>
            <InputNumber placeholder="100" addonAfter=""/>
          </Form.Item>
          <Form.Item name="CosineThreshold" label="Cosine Threshold" rules={[{required: true, }, ]} style={{display:'inline-block', marginRight:"5%"}}>
            <InputNumber placeholder="0.5" addonAfter=""/>
          </Form.Item>
          <Form.Item label="Allosteric path" >
            <Form.Item name="PRSSourceNode"  rules={[{required: true, },]} className='Source' style={{display:'inline-block',width:"20%"}}>
              <InputNumber placeholder="Source residue" addonAfter="->" style={{width:"100%"}}/>  
            </Form.Item>
            <Form.Item name="PRSTargetNode" rules={[{required: true, }, ]} style={{display:'inline-block', width:"20%"}}>
              <InputNumber placeholder="Target residue" addonAfter="" style={{width:"100%"}}/>
            </Form.Item>
            <Form.Item style={{textAlign:"center", display:"inline-block", marginLeft:"5%"}}>
              <Button type="primary" htmlType="submit" style={{backgroundColor:font_color, fontWeight:"bold"}}>Change </Button>
            </Form.Item>
          </Form.Item>
        </Form>
      </Card>
    </ConfigProvider>
    <Row style={{marginTop:"2vh"}}>
      <Col span={12}>
        <div style={{}}>
          {
            ifStruc
            ?
            <PV setIfStruc={setIfStruc} pvPaths={pvPaths} StrucPDBPath={props.results.StrucPDBPath} method="prs"/>
            :
            <div style={{height:'50vh',padding:"10%",border:"2px dashed lightblue"}}><UploadStrucPDB results={props.results} setResults={props.setResults} setIfStruc={setIfStruc}/></div>
          }
        </div>
      </Col>
      <Col span={12}>
        <div style={{height:"50vh", marginLeft:"1%"}}>{ListPath(props.results.data.prs.path)}</div>
      </Col>
    </Row>
  </>
}

///////////////////////////
//Change EHH path
///////////////////////////
const EhhPath = (props)=>{
  const navigate = useNavigate()
  const [pathsLoading,setPathsLoading] = useState(false)
  const [ehhpathForm] = Form.useForm()
  const [pvPaths,setPvPaths] = useState();
  const [ifStruc,setIfStruc] = useState();

  useEffect(()=>{
    if(props.results.data.ehh !== undefined){
      ehhpathForm.setFieldsValue({
          EHHSourceNode: props.results.data.ehh.EHHSourceNode,
          EHHTargetNode: props.results.data.ehh.EHHTargetNode,
        })
    }
  },[])

  useEffect(()=>{
    if(props.results.data.ehh.path.length >=1){
      setPvPaths([Paths2List(props.results.data.ehh.path)[0]])
    }
  },[])


  useEffect(()=>{
    if(props.results.StrucPDBPath !== undefined && props.results.StrucPDBPath !== null){
      setIfStruc(true)
    }else{
      setIfStruc(false)
    }
  },[props.results.StrucPDBPath])

  var onFinish = async (values) => {
    setPathsLoading(true)
    var EHHSourceNode = values.EHHSourceNode
    var EHHTargetNode = values.EHHTargetNode
    const JobID = props.id
    const req={JobID, EHHSourceNode, EHHTargetNode}
    try{
      const res = await repathEhhApi(req)
      props.setResults({...props.results, data:{...props.results.data, ehh:{...props.results.data.ehh, path:res.path, EHHSourceNode:EHHSourceNode, EHHTargetNode:EHHTargetNode}}})
      setPathsLoading(false)
    } catch (error) {
      navigate('/error')
    }
  };

  const cm = [{title:'Path Name',dataIndex:'pathname', width: "15%", },
              {title:'Path',dataIndex:'path',width:"65%"},
              // {title:'Probability',dataIndex:'probability',width:"20%"},
            ]

  const Paths2List = (paths) =>{
    if(paths!==undefined){
      var paths_arr = new Array()
      for(let i=0; i< paths.length; i++){
        var nodes = paths[i].path.split('->')
        paths_arr.push(nodes.map(Number).filter(Number.isInteger))
      }
      return paths_arr
    }

  }
  const ListPath = (ehhpath) => {
    return ( <div>
      <Table loading={pathsLoading} dataSource={ehhpath} rowSelection={{type: "checkbox",  defaultSelectedRowKeys:[1], 
        onChange: (selectedRowKeys, selectedRows) => {
          var arr = new Array()
          for(let i=0;i<selectedRowKeys.length;i++){
            arr.push(ehhpath[selectedRowKeys[i]-1])
          }
          setPvPaths(
            Paths2List(arr)
          )
        },
      fixed: false, }} columns={cm}  bordered pagination={false} size="middle"/>
      </div>);
  };   
  return <>
    <ConfigProvider theme={{components: { Form: {itemMarginBottom:"1vh", }, Button:{defaultBg:content_background_color}}, }}>
      <Card style={{width:"90%", marginTop:"1vh", border:"1px solid grey", backgroundColor:"#f2f4f5"}}>
          <Form name="ehh path form" onFinish={onFinish} wrapperCol={{offset:0, span: 24}}  form={ehhpathForm}>
          <Form.Item name="EHHSourceNode" label="Allosteric path" rules={[{required: true, },]} className='Source' style={{display:'inline-block', width:"30%"}}>
            <InputNumber placeholder="Source residue" addonAfter="->" style={{width:"100%"}}/>  
          </Form.Item>
          <Form.Item name="EHHTargetNode" rules={[{required: true, }, ]} style={{display:'inline-block', width:"20%"}}>
            <InputNumber placeholder="Target residue" addonAfter="" style={{width:"100%"}}/>
          </Form.Item>
          <Form.Item style={{textAlign:"center", display:"inline-block", marginLeft:"5%"}}>
              <Button type="primary" htmlType="submit" style={{backgroundColor:font_color, fontWeight:"bold"}}>Change </Button>
            </Form.Item>
        </Form>
      </Card>
    </ConfigProvider>
    <Row style={{marginTop:"2vh"}}>
      <Col span={12}>
        <div style={{}}>
          {
            ifStruc
            ?
            <PV setIfStruc={setIfStruc} pvPaths={pvPaths} StrucPDBPath={props.results.StrucPDBPath} method="ehh"/>
            :
            <div style={{height:'50vh',padding:"10%",border:"2px dashed lightblue"}}><UploadStrucPDB results={props.results} setResults={props.setResults} setIfStruc={setIfStruc}/></div>
          }
        </div>
      </Col>
      <Col span={12}>
        <div style={{marginLeft:"1%"}}>{ListPath(props.results.data.ehh.path)}</div>
      </Col>
    </Row>
  </>
}

///////////////////////////
//Change CNA path
///////////////////////////
const CnaPath = (props)=>{
  const navigate = useNavigate()
  const [pathsLoading,setPathsLoading] = useState(false)
  const [cnapathForm] = Form.useForm()
  const [pvPaths,setPvPaths] = useState();
  const [ifStruc,setIfStruc] = useState();

  useEffect(()=>{
    if(props.results.data.cna !== undefined){
      cnapathForm.setFieldsValue({
          CNASourceNode: props.results.data.cna.CNASourceNode,
          CNATargetNode: props.results.data.cna.CNATargetNode,
        })
    }
  },[])

  useEffect(()=>{
    if(props.results.data.cna.path.length >=1){
      setPvPaths([Paths2List(props.results.data.cna.path)[0]])
    }
  },[])


  useEffect(()=>{
    if(props.results.StrucPDBPath !== undefined && props.results.StrucPDBPath !== null){
      setIfStruc(true)
    }else{
      setIfStruc(false)
    }
  },[props.results.StrucPDBPath])

  var onFinish = async (values) => {
    setPathsLoading(true)
    var CNASourceNode = values.CNASourceNode
    var CNATargetNode = values.CNATargetNode
    const JobID = props.id
    const req={JobID, CNASourceNode, CNATargetNode}
    try{
      const res = await repathCnaApi(req)
      props.setResults({...props.results, data:{...props.results.data, cna:{...props.results.data.cna, path:res.path, CNASourceNode:CNASourceNode, CNATargetNode:CNATargetNode}}})
      setPathsLoading(false)
    } catch (error) {
      navigate('/error')
    }
  };

  const cm = [{title:'Path Name',dataIndex:'pathname', width: "15%", },
              {title:'Path',dataIndex:'path',width:"65%"},
              // {title:'Probability',dataIndex:'probability',width:"20%"},
            ]


  const Paths2List = (paths) =>{
    if(paths!==undefined){
      var paths_arr = new Array()
      for(let i=0; i< paths.length; i++){
        var nodes = paths[i].path.split('->')
        paths_arr.push(nodes.map(Number).filter(Number.isInteger))
      }
      return paths_arr
    }

  }
  const ListPath = (cnapath) => {
    return ( <div>
      <Table loading={pathsLoading} dataSource={cnapath} rowSelection={{type: "checkbox",  defaultSelectedRowKeys:[1], 
        onChange: (selectedRowKeys, selectedRows) => {
          var arr = new Array()
          for(let i=0;i<selectedRowKeys.length;i++){
            arr.push(cnapath[selectedRowKeys[i]-1])
          }
          setPvPaths(
            Paths2List(arr)
          )
        },
      fixed: false, }} columns={cm}  bordered pagination={false} size="middle"/>
      </div>);
  };   
  return <>
    <ConfigProvider theme={{components: { Form: {itemMarginBottom:"1vh", }, Button:{defaultBg:content_background_color}}, }}>
      <Card style={{width:"90%", marginTop:"1vh", border:"1px solid grey", backgroundColor:"#f2f4f5"}}>
        <Form name="cna path form" onFinish={onFinish} wrapperCol={{offset:0, span: 24}}  form={cnapathForm}>
          <Form.Item name="CNASourceNode" label="Allosteric path" rules={[{required: true, },]} className='Source' style={{display:'inline-block', width:"30%"}}>
            <InputNumber placeholder="Source residue" addonAfter="->" style={{width:"100%"}}/>  
          </Form.Item>
          <Form.Item name="CNATargetNode" rules={[{required: true, }, ]} style={{display:'inline-block', width:"20%"}}>
            <InputNumber placeholder="Target residue" addonAfter="" style={{width:"100%"}}/>
          </Form.Item>
          <Form.Item style={{textAlign:"center", display:"inline-block", marginLeft:"5%"}}>
            <Button type="primary" htmlType="submit" style={{backgroundColor:font_color, fontWeight:"bold"}}>Change </Button>
          </Form.Item>
        </Form>
      </Card>
    </ConfigProvider>
    <Row style={{marginTop:"2vh"}}>
      <Col span={12}>
        <div style={{}}>
          {
            ifStruc
            ?
            <PV setIfStruc={setIfStruc} pvPaths={pvPaths} StrucPDBPath={props.results.StrucPDBPath} method="cna"/>
            :
            <div style={{height:'50vh',padding:"10%",border:"2px dashed lightblue"}}><UploadStrucPDB results={props.results} setResults={props.setResults} setIfStruc={setIfStruc}/></div>
          }
        </div>
      </Col>
      <Col span={12}>
        <div style={{ marginLeft:"1%"}}>{ListPath(props.results.data.cna.path)}</div>
      </Col>
    </Row>
  </>
}

export default function Result() {
  const { id } = useParams() //gain url id
  const navigate = useNavigate() //navgate
  //job status
  const [jobStatus, setJobStatus] = useState()
  const [results, setResults] = useState({})
  const [ifSearching, setIfSearching] = useState(true);
  const [table, setTable] = useState()
  const containerRef = useRef(null); 
  const prevScrollTopRef = useRef(0); 
  useEffect(() => {
    const container = containerRef.current; 
    container.scrollTop = prevScrollTopRef.current;
  }, []);
  const handleScroll = () => {
    const container = containerRef.current; 
    prevScrollTopRef.current = container.scrollTop;
  };


  //mount first check and button check agian
  useEffect(() => {
    check()
  }, [])
  
  //interval check
  useEffect(()=>{
    let timer = null;
    if(jobStatus == "Running" || jobStatus == "Searching"){
      if(jobStatus == "Searching"){
        check()
      }
      timer = setInterval(()=>{
        check();
      },5000);
    }else{
      clearInterval(timer);
    }
    return ()=>{
      clearInterval(timer);
    }
  },[jobStatus])

  const gpuDevice = <Tag icon={<HddOutlined/>} color="default">GPU</Tag>
  const cpuDevice = <Tag icon={<HddOutlined/>} color="default">CPU</Tag>
  const successTag = <Tag icon={<CheckCircleOutlined />} color="success">finished</Tag>
  const runningTag = <Tag icon={<SyncOutlined spin />} color="processing">running</Tag>
  const errorTag = <Tag icon={<CloseCircleOutlined />} color="error">error</Tag>
  
  const check = async () => {
    try{
      const res = await CheckApi({ JobID: id });
      console.log(res);
      if(res){
        if(res.code == 0){
          return navigate('/result/', { state: { message: res.message, jobid: id } })
        } else if (res.code == 1){
          console.log(res);
          if (res.infos.JobStatus=="Finished") {
          setResults({
            'data': res.infos.data, 
            'StrucPDBPath':res.infos.StrucPDBPath,
            'Example': res.infos.Example,
            'PRS':res.infos.PRS,
            'EHH':res.infos.EHH,
            'CNA':res.infos.CNA,
            'NumResidues': res.infos.NumResidues
          })
          // const updatedData = data.map((item) => item.toUpperCase());
          setTable([{ id:1, jobid:id, time:res.infos.Created_at.split('.')[0].replace('T', ' '), status:successTag,  device: gpuDevice}])
          setTimeout(()=>{
            setJobStatus("Finished")
            setIfSearching(false)
          }, 1000)
          } else if(res.infos.JobStatus=="Running"){
            setIfSearching(false)
            setJobStatus("Running")
            setTable([{ id:1, jobid:id, time:res.infos.Created_at.split('.')[0].replace('T', ' '), status:runningTag, device: gpuDevice}])
            message.success("fresh")
          } else{
            setIfSearching(false)
            setJobStatus("Error")
            setTable([{ id:1, jobid:id, time:res.infos.Created_at.split('.')[0].replace('T', ' '), status:errorTag,  device: gpuDevice}])
          }
        }
      }else{
        return navigate('/result', { state: { message: res.message, jobid: id } })
      }
    } catch (error) {
      navigate('/error')
    }
  }
  // return <Status setJobStatus={setJobStatus} table={table} jobid={id} />

  const getItems = (panelStyle) => [
    {
      key: '1',
      label: <Title level={3} style={{textAlign:"center"}}>1. Neural Relational Inference (NRI)</Title>,
      children: <>
      
        <Card title={<Title level={4}>1.1 Visualize the learned interactions between residues.</Title>} bordered={true}>
          <div style={{marginBottom:20}}>
          
            In the results genereated below, both rows and columns are residues of the input Carbon-Alpha skeleton, this heatmap demonstrates the inferred interactions between these residues
            from the NRIMD model. The color demonstrates the strength of the interaction. Dark color means strong interaction, light color means weak interaction. Users can tune the parameter below 
            to select customerized threshold.
          </div>
          <div>
            <Row>
              <Col span={12}>
                <Residue results={results} setResults={setResults} id={id}/>
              </Col>
              <Col span={12}>
                <Covariance results={results} setResults={setResults} id={id}/>
              </Col>
            </Row>
          </div>
        </Card>
        <Card title={<Title level={4}>1.2 Visualize the learned interactions between domain (optional).</Title>} bordered={true} style={{marginTop:"2vh"}}>
            <div style={{marginBottom:20}}>
              Comparing to the heatmap on interactions between residues genereated above, users can manually define the domains below to get the coarse grained heatmap between the domains.
            </div>
          <Domain results={results} setResults={setResults} id={id}/>
        </Card>
        <Card title={<Title level={4}>1.3 Find the allosteric paths and visualize them (optional).</Title>} bordered={true} style={{marginTop:"2vh"}}>
          <div style={{marginBottom:20}}>
            In this item, the user can obtain the paths from the allosteric source residue to the allosteric target residue, and also can reset it and get the real-time result. 
            If you want to visualize allosteric paths in proteins, make sure you upload the PDB structure file of the protein.
          </div>
          <NriPath results={results} setResults={setResults} id={id}/>
        </Card>
      </>,
      style: panelStyle,
    },
    {
      key: '2',
      label: <Title level={3}style={{textAlign:"center"}}>2. Pertubation Response Scanning (PRS)</Title>,
      children: <>
      {results.PRS?
      <>
      <Card title={<Title level={4}>2.1 Visualize the covariance of PRS.</Title>} bordered={true} style={{marginBottom:"2vh"}}>
        <div>The PRS covariance matrix was shown below, use can set given parameters to get desired result.</div>
        <div>
          <img style={{width:'50%'}} src={`data:image/png;base64,${results.data.prs.cov}`} alt=""/>  
          {/* <img style={{width:'50%'}} src={`data:image/png;base64,${results.data.prs.res}`} alt=""/>     */}
        </div>
      </Card>
      <Card title={<Title level={4}>2.2 Find the allosteric paths of PRS and visualize.</Title>} bordered={true}>
          <div style={{}}>
          In this item, the user can obtain the paths from the allosteric source residue to the allosteric target residue, and also can reset it and get the real-time result. 
          If you want to visualize allosteric paths in proteins, make sure you upload the PDB structure file of the protein.
          </div>
        <PrsPath results={results} setResults={setResults} id={id}/>
      </Card>
      </>
      :
      <div>Sorry, you don't choose PRS</div>  
      }
      </>,
      style: panelStyle,
    },
    {
      key: '3',
      label: <Title level={3}style={{textAlign:"center"}}>3. Effective Harmony Hessian (EHH)</Title>,
      children: <>
      {
        results.EHH?
        <>
          <Card title={<Title level={4}>3.1 Visualize the covariance of EHH.</Title>} bordered={true} style={{marginTop:"2vh"}}>
            <div>
            <div>The EHH covariance matrix was shown below, if the point color between two residues are more dark, there is a stronger correlation between them.</div>
              <img style={{width:'50%'}} src={`data:image/png;base64,${results.data.ehh.cov}`} alt=""/>   
            </div>
        </Card>
        <Card title={<Title level={4}>3.2 Find the allosteric paths of EHH and visualize them.</Title>} bordered={true} style={{marginTop:"2vh"}}>
          <div style={{marginBottom:20}}>
          In this item, the user can obtain the paths from the allosteric source residue to the allosteric target residue, and also can reset it and get the real-time result. 
          If you want to visualize allosteric paths in proteins, make sure you upload the PDB structure file of the protein.
          </div>
          <EhhPath results={results} setResults={setResults} id={id}/>
        </Card>
        </>
        :
        <div>Sorry, you don't choose CNA</div>  
      }
 
      </>,
      style: panelStyle,
    },
    {
      key: '4',
      label: <Title level={3} style={{textAlign:"center",}}>4. Cosntaint Netwrok Analysis (CNA)</Title>,
      children: <>
       {results.CNA?
        <>
        <Card title={<Title level={4}>4.1 Visualize the covariance of CNA.</Title>} bordered={true} style={{marginTop:"2vh"}}>
        <div>The CNA contact matrix was shown below, if the point color between two residues are more dark, there is a stronger contact between them.</div>
          <div>
            <img style={{width:'50%'}} src={`data:image/png;base64,${results.data.cna.cov}`} alt=""/>  
          </div>
        </Card>
        <Card title={<Title level={4}>4.2 Find the allosteric paths of CNA and visualize them.</Title>} bordered={true} style={{marginTop:"2vh"}}>
          <div style={{marginBottom:20}}>
            In this item, the user can obtain the paths from the allosteric source residue to the allosteric target residue, and also can reset it and get the real-time result. 
            If you want to visualize allosteric paths in proteins, make sure you upload the PDB structure file of the protein.
          </div>
          <div><CnaPath results={results} setResults={setResults} id={id}/></div>
        </Card>
        </>
        :
        <div>Sorry, you don't choose CNA
        </div>  
        }
      </>,
      style: panelStyle,
    },
  ];


  


  const AnalysisResult = () => {
    const { token } = theme.useToken();
    const panelStyle = {
      marginBottom: 24,
      background: "",
      borderRadius: token.borderRadiusLG,
      border: '1px solid gray',
    };

    return (
      <div>
      


      <Collapse expandIconPosition={'end'}
        bordered={false}
        defaultActiveKey={['1', '2', '3', '4']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        style={{
          color:'white',
          background: content_background_color,
        }}
        items={getItems(panelStyle)}
      />
      
      </div>
    );
  };

  return <div style={{marginTop:"2vh"}}
  
  
  ref={containerRef}
  className="scroll-container"
  onScroll={handleScroll} // 监听滚动事件
  >
    <LoadingResultLogo JobID={id} ifSearching ={ifSearching}/>
    {jobStatus=="Finished"
    ?
    <>
        <div style={{marginBottom:'2vh'}}>
            <span style={{ fontWeight: 'bold' }}>Note: All finished jobs will be deleted automatically in 14 days.</span> <div style={{float:"right"}}>device: <HddOutlined/>CPU</div>
            <div style={{marginTop:"1vh"}}>All the results can be downloaded:     
              <a href={'/api/nrimd/download/download_result/'+id+'/'} style={{marginLeft: 20}}>
                <Button icon={<DownloadOutlined />} style={{backgroundColor:font_color, fontWeight:"bold", color:"white"}}>Download Results</Button>
              </a>
            </div>
        </div>
        <AnalysisResult style={{marginTop:"2vh"}}/>
    </>
    :
    <Status setJobStatus={setJobStatus} table={table} jobid={id} />
    }
  </div>
  }
