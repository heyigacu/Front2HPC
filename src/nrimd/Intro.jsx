import React, { useState } from 'react'
import { Button, Alert, message, Steps, theme, Divider } from 'antd';
import { Link, } from 'react-router-dom';
import rotate from './assets/images/introduction/rotate.gif'
import membrane_protein from './assets/images/introduction/membrane_slowdown.gif'
import workflow from './assets/images/introduction/workflow_new.png'


const INTRODUCTION = <div >
  <Alert style={{margin:"1%", marginBottom:0}} message={  <div style={{color:'red', textAlign:'left'}}>     
    Notice: NRIMD webserver will be unavailable from Jan 28, 2024, 8:00AM EST to 4:00PM EST due to Cloud provider Jetstream2 Networking Maintenance (https://jetstream.status.io/).
  </div>}  banner />

  <div style={{lineHeight:"20px", textAlign:"left", margin:"2%"}}>
  <h2 style={{fontWeight:"bold"}}>Analyzing long-range interactions in molecular dynamics simulations using deep learning</h2>
    <div>
    Long-range allostery communication between distant sites in proteins is central to biological regulation but still poorly characterized, 
    limiting the development of protein engineering and drug design. 
    Molecular dynamics (MD) simulation provides a powerful computational approach to probe the allosteric effect and other long-range interactions.
    Based on our recent works on neural relational inference using graph neural networks (<a href="https://www.nature.com/articles/s41467-022-29331-3">Zhu et al., Nature Communications</a>), 
    we developed <Link to='/introduction'>NRIMD</Link>, a web server for analyzing long-range interactions in proteins from MD simulation. 
    NRIMD also provides three other protein long-range interaction analysis methods for comparison.
    In addition, three trajectory sampling strategies have been added for proteins with sequence lengths greater than 500 amino acids to reduce memory overhead.
    The cloud-based web server accepts MD simulation data in the Carbon-Alpha skeleton format from mainstream MD software GROMACS, AMBER, and NAMD. 
    The input MD trajectory data is validated in the front end, and then submitted to the backend on a High-Performance Computer system supported by Indiana University cyberinfrastructure. 
    Due to its computational intensity on GPUs, the submitted tasks will be lined up in the computational queue in the HPC. 
    The results include the learned long-range interactions and pathways that can mediate the long-range interactions between distant sites, and the visualization from the trajectories obtained in MD.
    </div>
  </div>
  <div style={{textAlign:"center"}}> <img src={workflow} style={{width:"80%"}}/></div>
  {/* <div style={{textAlign:"center", lineHeight:"20px"}}>Figure 1. The workflow of the study.</div> */}
  </div>

const SUBMIT = <div >
  <div style={{lineHeight:"20px", textAlign:"left", margin:"2%"}}>
    <div>
    User need follow the steps below:
    <ul>
      <li>
        (1) Prapare protein binary trajectory from molecular dynamics well.
      </li>
      <li>
        (2) Use MD softwares, VMD or python script we afford to transform binary trajectory to Ca-atom trajecory in PDB format, please see User Guide section.
      </li>
      <li>
        (3) Go to submit page, upload your processed trajectory and choose suitable parameters, and submit.
      </li>
      <li>
        (4) NRIMD will give you a Job ID, it's very import, please record it. It will be used to check job and get job result!
      </li>
    </ul>
    </div>
  </div>
  </div>

const RESULT =<div style={{lineHeight:"20px", textAlign:"left", margin:"2%"}}>
  <ul>
    <li>
    Once the job has been submitted, users can get Job Id, and users can check the job status ( running or finished ) in Get Result page.
    </li>
    <li>
    Users can can either bookmark the results as https://nrimd.luddy.iupui.edu/result/ + Job ID, or click the link in the emailbox if the email address is provided.
    </li>
    <li>
    As the deep learning based jobs take some time (~1 hour or longer, depends on the sequence length and the queue in the HPC).
    </li>
    <li>
    Finally, you can enjoy the NRIMD results and do some change in Result page to get desired results.
    </li>
  </ul>
    
    
    

  </div>



const steps = [
  { title: 'INTRODUCTION', content: INTRODUCTION, },
  { title: 'SUBMIT', content: SUBMIT, },
  { title: 'RESULT', content: RESULT, },
];


const StepsApp = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    console.log('onChange:', value);
    setCurrent(value);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  return (
    <>
      <Steps
        current={current}
        onChange={onChange}
        items={items}
      />
      <div><div style={contentStyle}>{steps[current].content}</div></div>
    </>
  );
};



export default function Intro() {
  return (
  <div>
    <div>
      <div style={{margin:"2vh 2%"}}>
        <img src={membrane_protein} style={{width:"100%", height:"30vh"}}/>
      </div>
      <div style={{margin:"2vh 2%"}}>
        <StepsApp style={{height:"2vh"}}/>
        {/* {INTRODUCTION} */}
      </div>
    </div>
    </div>
  )
}
