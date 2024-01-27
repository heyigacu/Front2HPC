import React from 'react';
import { Card } from 'antd';
import ShuaiZeng from './assets/images/contact/Shuai-Zeng.jpg';
import WeiweiHan from './assets/images/contact/Weiwei-Han.jpg';
import YiHe from './assets/images/contact/Yi-He.jpeg';
import ShuangWang from './assets/images/contact/Shuang-Wang.jpeg';
import JuexinWang from './assets/images/contact/Juexin-Wang.jpeg';
import DongXu from './assets/images/contact/Dong-Xu.png';
const font_color = "#112264"
const menu_background_color = "#001529"
const content_background_color =  "#edeff7"

const Contact = () => (
  <>
  <div style={{fontSize:"2.4vh", backgroundColor:font_color, color:"white", textAlign:"center", fontWeight:"bold",height:"5vh", lineHeight:"5vh",margin:"1vh 0" }}>
    Faculty 
  </div>
  <div style={{display:"flex"}}>
      <Card hoverable bordered style={{width:"26.6%", margin:"1vh 2.5% 1vh 10%", textAlign:"center"}}>
          {/* <div><img src={JuexinWang} style={{ width:"60%", height:"20vh", marginBottom:"0.5vh"}}/></div> */}
          <div style={{fontSize:"20px"}}>Juexin Wang</div>
          <div style={{marginBottom:"0.5vh"}}>Professor </div>
          <div style={{marginBottom:"0.5vh"}}>Department of Computer Science, Luddy School of Informatics, Computing, and Engineering, Indiana University Bloomington</div>
          <div><span style={{backgroundColor:'#4a4a4a', color:"white", padding:"0.5vh 1%", marginBottom:"0.2vh"}}>wangjuex@iu.edu</span></div>
      </Card>
      <Card hoverable bordered style={{width:"26.6%", margin:"1vh 2.5% 1vh 2.5%", textAlign:"center"}}>
          {/* <div><img src={WeiweiHan} style={{ width:"60%", height:"20vh", marginBottom:"0.5vh"}}/></div> */}
          <div style={{fontSize:"20px"}}>Weiwei Han</div>
          <div style={{marginBottom:"0.5vh"}}>Professor </div>
          <div style={{marginBottom:"0.5vh"}}>Key Laboratory for Molecular Enzymology & Engineering of the Ministry of Education, Life Science College, Jilin University</div>
          <div><span style={{backgroundColor:'#4a4a4a', color:"white", padding:"0.5vh 1%"}}>weiweihan@jlu.edu.edu</span></div>
      </Card>
      <Card hoverable bordered style={{width:"26.6%", margin:"1vh 10% 1vh 2.5%", textAlign:"center"}}>
          {/* <div><img src={DongXu} style={{ width:"60%", height:"20vh", marginBottom:"0.5vh"}}/></div> */}
          <div style={{fontSize:"20px"}}>Dong Xu</div>
          <div style={{marginBottom:"0.5vh"}}>Professor </div>
          <div style={{marginBottom:"0.5vh"}}>Department of Electrical Engineering and Computer Science, University of Missouri</div>
          <div><span style={{backgroundColor:'#4a4a4a', color:"white", padding:"0.5vh 1%"}}>xudong@missouri.edu</span></div>
      </Card>
  </div>
  <div style={{fontSize:"2.4vh", backgroundColor:font_color, color:"white", textAlign:"center", fontWeight:"bold",height:"5vh", lineHeight:"5vh",margin:"1vh 0" }}>
      Developers 
  </div>
  <div style={{display:"flex"}}>
      <Card hoverable bordered style={{width:"26.6%", margin:"1vh 2.5% 1vh 10%", textAlign:"center"}}>
          {/* <div><img src={YiHe} style={{ width:"60%", height:"20vh", marginBottom:"0.5vh"}}/></div> */}
          <div style={{fontSize:"20px"}}>Yi He</div>
          <div style={{marginBottom:"0.5vh"}}>M.S. Student </div>
          <div style={{marginBottom:"0.5vh"}}>Key Laboratory for Molecular Enzymology & Engineering of the Ministry of Education, Life Science College, Jilin University</div>
          <div><span style={{backgroundColor:'#4a4a4a', color:"white", padding:"0.5vh 1%"}}>heyi21@mails.jlu.edu.cn</span></div>
      </Card>
      <Card hoverable bordered style={{width:"26.6%", margin:"1vh 2.5% 1vh 2.5%", textAlign:"center"}}>
          {/* <div><img src={ShuangWang} style={{ width:"60%", height:"20vh", marginBottom:"0.5vh"}}/></div> */}
          <div style={{fontSize:"20px"}}>Shuang Wang</div>
          <div style={{marginBottom:"0.5vh"}}>Ph.D. Student </div>
          <div style={{marginBottom:"0.5vh"}}>Department of Computer Science, Luddy School of Informatics, Computing, and Engineering, Indiana University Bloomington</div>
          <div><span style={{backgroundColor:'#4a4a4a', color:"white", padding:"0.5vh 1%"}}>sw152@iu.edu</span></div>
      </Card>
      <Card hoverable bordered style={{width:"26.6%", margin:"1vh 10% 1vh 2.5%", textAlign:"center"}}>
          {/* <div><img src={ShuaiZeng} style={{ width:"60%", height:"20vh", marginBottom:"0.5vh"}}/></div> */}
          <div style={{fontSize:"20px"}}>Shuai Zeng</div>
          <div style={{marginBottom:"0.5vh"}}>Ph.D. student </div>
          <div style={{marginBottom:"0.5vh"}}>Department of Electrical Engineering and Computer Science, University of Missouri</div>
          <div ><span style={{backgroundColor:'#4a4a4a', color:"white", padding:"0.5vh 1%"}}>shuaizeng@missouri.edu</span></div>
      </Card>
  </div>
  </>
);
export default Contact;


