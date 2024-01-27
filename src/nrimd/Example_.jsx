
import { Collapse, Select, ConfigProvider, theme, Form, Upload, Button } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import example_submit from './assets/images/guide/example_submit.png'
import example_check from './assets/images/guide/example_check.png'
import result_nri_res from "./assets/images/guide/result_nri_res.png"
import result_nri_domain from "./assets/images/guide/result_nri_domain.png"
import result_nri_path from "./assets/images/guide/result_nri_path.png"
import all_paths from "./assets/images/guide/all_paths.png"
import PV from './components/result_components/PV'
import React, { useEffect, useState } from 'react'
const text_font_color = "rgba(17, 34, 100)"


const text_font = { fontSize:"2vh", fontWeight:"bold", color:"balck"}


const Example = () => {
  const [exampleStrucPDBPath, setExampleStrucPDBPath] = useState('sod1.pdb')
  const [ifStruc, setIfStruc] = useState(true)
  const { token } = theme.useToken();

  const UploadStrucPDB = () => {
    const [strucFileList, setStrucFileList] = useState([]);
    const strucHandleChange = (info) => {
      let newFileList = [...info.fileList];
      newFileList = newFileList.slice(-1);
      newFileList = newFileList.map((file) => {
        if (file.response) {
          console.log(file.response);
          setExampleStrucPDBPath(file.response.StrucPDBPath)
          setIfStruc(true)
        }
        return file;
      });
      setStrucFileList(newFileList);
    };
    const strucProps={action:'/api/nrimd/submit/upload_strucpdb/',onChange:strucHandleChange,multiple:false}
  
    return (
      <>
      <Form name="complex-form" labelCol={{span: 6,}} wrapperCol={{span: 18,}}>
            <Form.Item name="StrucFile" label="PDB File" extra="optional, upload protein structure pdb file (include all atoms) can visualize long-range allosteric interactions in protein " >
              <Upload {...strucProps} fileList={strucFileList}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
      </Form>
      <div style={{textAlign:'center'}}><Button type="primary" onClick={()=>{setIfStruc(true)}} icon={<CloseOutlined />}>Cancel</Button></div>
      </>
    );
  };

  const panelStyle = {
    marginBottom: "0.5vh",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
  };
  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: '1',
      label: 'Example 1: Copper-zinc superoxide dismutase-1 (SOD1)',
      children: <>
      <div style={{fontWeight:"bold"}}>Introduction</div>
      <ul>
        <li>
        Copper-zinc superoxide dismutase-1 (SOD1) is an oxidoreductase responsible for decomposing toxic superoxide 
        radicals into molecular oxygen and hydrogen peroxide in two rapid steps by alternately reducing and oxidizing active-site copper26. 
        </li>
        <li>
        A study of the SOD1-linked neurodegenerative disorder amyotrophic lateral sclerosis (ALS) shows that the G93A mutation
        forces the EL to move away from ZL, decreasing the Zn (II) affinity of the protein, which affects the pathogenic process of the SOD1-linked ALS29.
        </li>
        <li>
        Since the G93A mutation occurs away from the metal site, this process is allosteric.
        </li>
        <li>
        Next, let's perform NRIMD analysis of the molecular dynamics simulation trajectory of G93A mutant!
        </li>
      </ul>

      <div style={{fontWeight:"bold"}}>1. Get the correct input</div>
      <ul>
        <li>
          Example trajectory were built by Amber 22, you can download it <a href={'/api/nrimd/download/download_sod_catraj/'}>here</a>.
        </li>
        <li>
          If you want upload yourself trajectory, you can refer the User Guide section.
        </li>
      </ul>
      <div style={{fontWeight:"bold"}}>2. Submit the example trajectory</div>
      <div>You can follow the picture below to submit the example job in submit page</div>
      <img src={example_submit} style={{border:'1px solid #000', width:"60%", display:"block"}}></img>
      <div>We will give you a job ID, please record it!</div>
      <div style={{fontWeight:"bold"}}>3. Get the result</div>
      <div>Next you can check job in Get Result page:</div>
      <img src={example_check} style={{border:'1px solid #000', width:"60%", display:"block"}}></img>
      <div>But for the example, it will show result directly !</div>
      <div> In the results genereated below, both rows and columns are residues of the input Carbon-Alpha skeleton, 
        this heatmap demonstrates the inferred interactions between these residues from the NRIMD model. 
        The color demonstrates the strength of the interaction. Dark color means strong interaction, light color means weak interaction. 
        Users can tune the parameter below to select customerized threshold.</div>
        <img src={result_nri_res} style={{width:"60%", border:"1px solid gray"}}></img>
        <div> Comparing to the heatmap on interactions between residues genereated above, 
          users can manually define the domains below to get the coarse grained heatmap between the domains.</div>
        <img src={result_nri_domain} style={{width:"60%", border:"1px solid gray"}}></img>
        <div>In this item, the user can obtain the paths from the allosteric source residue to the allosteric target residue, 
          and also can reset it and get the real-time result. And the pathways can be visualized in the left, you can also set protein and pathway style to get beautiful figures.</div>
          <div>For example, residue 93 is allosteric site and residue 134 is active sites, we choosed all pathways in the protein and set beautiful style: </div>
        <img src={result_nri_path} style={{width:"60%", border:"1px solid gray"}}></img>
        

        <div>We provide a free test to visualize allosteric paths in protein.</div>
        <div style={{width:"50%"}}>
        {
          ifStruc
          ?
          <PV StrucPDBPath = {exampleStrucPDBPath} setIfStruc={setIfStruc} method="example"/>
          :
          <div style={{height:'50vh',padding:"10%",border:"2px dashed lightblue"}}><UploadStrucPDB /></div>
           
        }
        
      </div>

      </>,
      style: panelStyle,
    },

  ];
  return (
    <div style={{margin:"2vh 2%"}}>
      <div style={{...text_font,width:"100%",margin:"2vh 0"}}> Here we provide an example of how to use NRIMD Webserver: </div>
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              contentBg:""
            },
          },
        }}
      >
          <Collapse defaultActiveKey={['1']} onChange={onChange} expandIconPosition={"end"} items={items} ghost={false} accordion={true} style={{...text_font, fontWeight:"-moz-initial",fontSize:"1.8vh",}}/>
      </ConfigProvider>
    </div>
  );
};
export default Example;
