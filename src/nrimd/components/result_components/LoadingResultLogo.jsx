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

const LoadingResultLogo = (props) => {
	  console.log(props)
	  return (
		      <>
		        <Modal
		          open={props.ifSearching}
		          closable={false}
		          footer={null}
		          style={{textAlign:"center",paddingTop:"200px"}}
		        >
		          <Spin indicator={antIcon} style={{paddingTop:"40px"}}/>
		          <p>Loading Result...</p>
		        </Modal>
		      </>
		    );
};
export default LoadingResultLogo;

