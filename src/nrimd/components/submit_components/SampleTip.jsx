import { Modal } from 'antd';
import React, { useState } from 'react';
import { Button } from 'antd';
const VisualThresholdHelp = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal title="Force Sampling Tip !" footer={null} open={isModalOpen} closable={false} okText={false} cancelText={false} width={1000}>
        <div>
        Due to the capacity of the available hardware, for protein lenger larger than 300 residues, please choose one of the sampling methods.
	</div> 
        <div style={{textAlign:"right"}}><Button type="primary" onClick={handleCancel}>OK</Button></div>
      </Modal>
    </>
  );
};
export default VisualThresholdHelp;



