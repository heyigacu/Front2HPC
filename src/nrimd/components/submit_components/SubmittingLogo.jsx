import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const SubmittingLogo = (props) => {
  console.log(props)
  return (
    <>
      <Modal
        open={props.ifSubmitting}
        closable={false}
        footer={null}
        style={{textAlign:"center",paddingTop:"200px"}}
      >
        <Spin indicator={antIcon} style={{paddingTop:"40px"}}/>
        <p>submitting</p>
      </Modal>
    </>
  );
};
export default SubmittingLogo;





