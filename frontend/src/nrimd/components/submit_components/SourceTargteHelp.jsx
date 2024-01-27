import { Modal, Button } from 'antd';
import React, { useState } from 'react';

import source_target from "../../assets/images/submit/StartEnd.png"
const StartEnd = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <a type="primary" onClick={showModal} >
        More
      </a>
      <Modal title="How to set domain information:" footer={null} closable={false} open={isModalOpen} okText={false} cancelText={false} onCancel={handleCancel} width={1000}>
        <div>
            Allosteric Path is the pathways between allosteric site (source node) and active site (target node):
        </div> 
        <div>
        In the following, the source node and target node were set 93 and 134 respectively:
        </div>
        <img src={source_target} style={{width:"30%"}}></img>
	<div style={{textAlign:"right"}}><Button type="primary" onClick={handleCancel}>Close</Button></div>
      </Modal>
    </>
  );
};
export default StartEnd;
