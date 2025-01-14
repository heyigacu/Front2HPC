
import React, { useState } from 'react';
import { Button, Drawer,Tooltip } from 'antd';
import { DownloadOutlined} from '@ant-design/icons';
import {Link, useNavigate} from 'react-router-dom'
import examplepdbimg from '../../assets/images/guide/example_traj.png'



const ExampleStrucPDBDrawer = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const title = <>
                  <span style={{color:'black'}}>example SOD1_ca_traj.zip</span> &emsp;
                    <a href='/api/nrimd/download/download_sod_catraj/'>
                                      <Button type="primary" icon={<DownloadOutlined />} >
                                Download
                              </Button></a>
                </>
  return (
    <>
      <a type="primary" onClick={showDrawer}>
        example 
      </a>
      <Drawer title={title} placement="right" onClose={onClose} open={open} size={'large'}>
        <div>
          <img src={examplepdbimg} alt="" width={'130%'}></img>
        </div>
      </Drawer>
    </>
  );
};
export default ExampleStrucPDBDrawer
