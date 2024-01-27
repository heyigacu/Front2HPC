import React, { useState, useEffect } from 'react';
import { useLocation, } from 'react-router-dom';
import { FileUnknownOutlined, GithubOutlined, FolderOutlined, PlusCircleOutlined, RocketOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, ConfigProvider } from 'antd';
import { Outlet,Link, } from 'react-router-dom';
import nrimd_sider_logo from './nrimd/assets/images/nrimd_sider_logo.png';
import './nrimd/assets/lesses/app.less'
import CookieConsent from "react-cookie-consent";

const { Header, Content, Footer, Sider } = Layout;

const github_utl = "https://github.com/juexinwang/NRI-MD"

const items = [
  { label: <Link to='/introduction'>Introduction</Link>, key: 'introduction', icon: <RocketOutlined /> },
  { label: <Link to='/submit'>Submit Job</Link>, key: 'predict', icon: <PlusCircleOutlined /> },
  { label: <Link to='/result'>Get Result</Link>, key: 'dataset', icon: <FolderOutlined /> },
  { label: <Link to='/example'>Example</Link>, key: 'example', icon:<FileUnknownOutlined /> },
  { label: <Link to='/guide'>User Guide</Link>, key: 'help', icon:<FileUnknownOutlined /> },
  { label: <Link to='/contact'>Contact us</Link>, key: 'contact', icon:<UserOutlined /> },
  { label: <a href={github_utl} target="_blank">Github</a>, key: 'github', icon: <GithubOutlined /> },
]

const font_color = "#112264"
const menu_background_color = "#001529"
const content_background_color =  "#edeff7"

const App = () => {
  return (
    <Layout style={{minHeight: "calc(100vh)"}}>
          <Sider width={"15%"} style={{backgroundColor: menu_background_color}}>
              <img src={nrimd_sider_logo} style={{float:"left", width:"80%", margin:"2vh 10%",}}/>
              {/* <span style={{display:"inline-block", width:"55%", lineHeight: "40px", margin: "10px 5%", fontSize:"25px", fontWeight:"bold", color:"white"}}>PredCoffee</span> */}
            <ConfigProvider theme={{ components: {Menu: { iconSize: "2vh", darkItemSelectedBg:"purple", iconMarginInlineEnd:"1vh", itemMarginBlock:"0", itemMarginInline:"0", itemPaddingInline:"0.1vh"}}}}> 
              <Menu theme="dark" mode="inline"  defaultSelectedKeys={[]} className='nrimd_menu'  style={{fontSize:"2vh", fontWeight:"bold", backgroundColor:menu_background_color}} items={items} /> 
            </ConfigProvider>
          </Sider>
          <Layout style={{backgroundColor: content_background_color}}>
            <header>
              <div style={{borderBottom:"1px solid rgba(5, 5, 5, 0.2)", backgroundColor:content_background_color}}>
                <div style={{ width:"100%", display:"inline-block", padding:"2vh", textAlign:"center", fontSize:"2.5vh", fontWeight:"bold", color:font_color}}>NRIMD: a web server for analyzing long-range interactions in proteins from molecular dynamics simulations</div>
              </div>
            </header>
            <Content style={{padding:"1vh 1%"}}>
              <Outlet />
            </Content>
            <Footer style={{backgroundColor: content_background_color, borderTop:"1px solid rgba(5, 5, 5, 0.2)",fontSize:"1.5vh", textAlign:"center"}}>
              <div style={{marginBottom:"0.5vh"}}><b style={{color:font_color, marginBottom:"0.6vh"}}>Citation:</b> Zhu, J., Wang, J., Han, W., & Xu, D. (2022). Neural relational inference to learn long-range allosteric interactions in proteins from molecular dynamics simulations. Nature communications, 13(1), 1-16.</div>
              <div style={{textAlign:"center"}}>NRIMD ©2022-2024 Created by Yi He</div>
            </Footer>
            <CookieConsent debug={false}>This site uses cookies provided by the university. <Link to='/cookies' style={{color:'aqua'}}>Learn More.</Link></CookieConsent>
        </Layout>
    </Layout>
  );
};

export default App;
