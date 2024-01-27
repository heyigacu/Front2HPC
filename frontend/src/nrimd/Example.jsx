
import { Collapse, Select, ConfigProvider, theme, Form, Upload, Button } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import example_submit from './assets/images/guide/example_submit.png'
import example_check from './assets/images/guide/example_check.png'
import example_upload_psh from './assets/images/guide/example_upload_psh.png'
import example_submit_psh from './assets/images/guide/example_submit_psh.png'
import result_nri_res from "./assets/images/guide/result_nri_res.png"
import result_nri_domain from "./assets/images/guide/result_nri_domain.png"
import result_nri_path from "./assets/images/guide/result_nri_path.png"
import result_nri_res_psh from "./assets/images/guide/result_nri_res.png"
import result_nri_domain_psh from "./assets/images/guide/result_nri_domain.png"
import result_nri_path_psh from "./assets/images/guide/result_nri_path_psh.png"
import all_paths from "./assets/images/guide/all_paths.png"
import PV from './components/result_components/PV'
import React, { useEffect, useState } from 'react'
const text_font_color = "rgba(17, 34, 100)"


const text_font = { fontSize:"2vh", fontWeight:"bold", color:"balck"}


const Example = () => {
  const [example1StrucPDBPath, setExample1StrucPDBPath] = useState('sod1.pdb')
  const [example2StrucPDBPath, setExample2StrucPDBPath] = useState('PSH.pdb')
  const [ifStruc1, setIfStruc1] = useState(true)
  const [ifStruc2, setIfStruc2] = useState(true)
  const { token } = theme.useToken();

  const UploadStrucPDB1 = () => {
    const [strucFileList, setStrucFileList] = useState([]);
    const strucHandleChange = (info) => {
      let newFileList = [...info.fileList];
      newFileList = newFileList.slice(-1);
      newFileList = newFileList.map((file) => {
        if (file.response) {
          console.log(file.response);
          setExample1StrucPDBPath(file.response.StrucPDBPath)
          setIfStruc1(true)
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
      <div style={{textAlign:'center'}}><Button type="primary" onClick={()=>{setIfStruc1(true)}} icon={<CloseOutlined />}>Cancel</Button></div>
      </>
    );
  };

  const UploadStrucPDB2 = () => {
    const [strucFileList, setStrucFileList] = useState([]);
    const strucHandleChange = (info) => {
      let newFileList = [...info.fileList];
      newFileList = newFileList.slice(-1);
      newFileList = newFileList.map((file) => {
        if (file.response) {
          console.log(file.response);
          setExample2StrucPDBPath(file.response.StrucPDBPath)
          setIfStruc2(true)
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
      <div style={{textAlign:'center'}}><Button type="primary" onClick={()=>{setIfStruc2(true)}} icon={<CloseOutlined />}>Cancel</Button></div>
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
      label: 'Example 1: Copper-zinc superoxide dismutase-1 (SOD1, 153 residues)',
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
          ifStruc1
          ?
          <PV StrucPDBPath = {example1StrucPDBPath} setIfStruc={setIfStruc1} method="example_sod1"/>
          :
          <div style={{height:'50vh',padding:"10%",border:"2px dashed lightblue"}}><UploadStrucPDB1 /></div>
           
        }
        
      </div>

      </>,
      style: panelStyle,
    },
    {
      key: '2',
      label: 'Example 2: Presenilin/SPP Homologue (PSH, 304 residues) ',
      children: <>
      <div style={{fontWeight:"bold"}}>Introduction</div>
      <ul>
        <li>
        Presenilin/SPP Homologue (PSH) is an intramembrane aspartyl protease that regulate important biological functions in eukaryotes and it contains 9 TM domains (TM 1-9).
        </li>
        <li>
        A study of PSH showed three mutations, including V151E and L155S in TM6, and S225I in TM7, may affect active sites Asp 162 and Asp 220 through altered local conformation.
        </li>
        <li>
        For a far-reaching exploration, we can use NRIMD to find the allosteric interaction between mutate site and active sites.
        </li>
      </ul>

      <div style={{fontWeight:"bold"}}>1. Get the correct input</div>
      <ul>
        <li>
          Example trajectory were built by Amber 22, you can download it <a href={'/api/nrimd/download/download_psh_catraj/'}>here</a>.
        </li>
        <li>
          Due to the capacity of the available hardware, for protein lenger larger than 300 residues, we will consider one of the sampling strategy to calculate the trajecory by NRIMD. So 
          let us do it!
        </li>
      </ul>
      <div style={{fontWeight:"bold"}}>2. Submit the example trajectory</div>
      <div>You can follow the picture below to submit the PSH example job in Submit Job page</div>
      <div>Firt you should upload trajecory file PSH_ca_traj.zip and upload it:</div>
      <img src={example_upload_psh} style={{border:'1px solid #000', width:"40%", display:"block"}}></img>
      <div>Next will give a force sampling tip, close it and choose one sampling method, here we choose first sampling strategy and submit job.</div>
      <img src={example_submit_psh} style={{border:'1px solid #000', width:"30%", display:"block"}}></img>
      <div>Commonly, NRIMD then will give user a job ID and wait for a job finish. But as example PSH, NRIMD will soon give result.</div>
      <div style={{fontWeight:"bold"}}>3. Get the result</div>
      <div>As how to check a job in example SOD1, user can check job in Get Result page by Job ID or bookmark with https://nrimd.luddy.iupui.edu/result/ + Job ID</div>
      <div>Finally, let's analysis results of PSH.</div>
      <div> In the results genereated below,
        the left heatmap demonstrates the inferred interactions between these residues from the NRIMD model. 
        The color demonstrates the strength of the interaction. Dark color means strong interaction, light color means weak interaction. 
        Users can tune the parameter below to select customerized threshold.</div>
        <img src={result_nri_res_psh} style={{width:"60%", border:"1px solid gray"}}></img>
        <div> Comparing to the heatmap on interactions between residues genereated above, 
          users can manually define the domains below to get the coarse grained heatmap between the domains.</div>
        <img src={result_nri_domain_psh} style={{width:"60%", border:"1px solid gray"}}></img>
        <div>In this item, the user can obtain the paths from the allosteric source residue to the allosteric target residue, 
          and also can reset it and get the real-time result. And the pathways can be visualized in the left, you can also set protein and pathway style to get beautiful figures.</div>
          <div>For example, residue 151 (here is 148 because protein miss beginning 3 residues) is allosteric site and residue 220 (here is 217) is active sites, we choosed all pathways in the protein and set beautiful style: </div>
        <img src={result_nri_path_psh} style={{width:"60%", border:"1px solid gray"}}></img>
        

        <div>We provide a free test to visualize allosteric paths in PSH, user can set allosteric path or desired protein style here.</div>
        <div style={{width:"50%"}}>
        {
          ifStruc2
          ?
          <PV StrucPDBPath = {example2StrucPDBPath} setIfStruc={setIfStruc2} method="example_psh"/>
          :
          <div style={{height:'50vh',padding:"10%",border:"2px dashed lightblue"}}><UploadStrucPDB2 /></div>
           
        }
      </div>

      </>,
      style: panelStyle,
    },
  ];
  return (
    <div style={{margin:"2vh 2%"}}>
      <div style={{...text_font,width:"100%",margin:"2vh 0"}}> Here we provide two examples of how to use NRIMD Webserver: </div>
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              contentBg:""
            },
          },
        }}
      >
          <Collapse defaultActiveKey={[]} onChange={onChange} expandIconPosition={"end"} items={items} ghost={false} accordion={true} style={{...text_font, fontWeight:"-moz-initial",fontSize:"1.8vh",}}/>
      </ConfigProvider>
    </div>
  );
};
export default Example;
