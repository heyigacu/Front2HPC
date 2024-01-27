import { Modal, Button } from 'antd';
import React, { useState } from 'react';


const DistThresholdHelp = () => {
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
      <Modal title="How to set domain information:" footer={null}  closable={false} open={isModalOpen} okText={false} cancelText={false} onCancel={handleCancel} width={1000}>
        <div>
            <div>
            Distance Threshold is the threshold for calculating covariance and allosteric pathways
            </div>
            <ul>
              <li>
                NRIMD will ignore the distance if residue distance larger than the Distance Threshold.
              </li>
            </ul>
        </div>
	<div style={{textAlign:"right"}}><Button type="primary" onClick={handleCancel}>Close</Button></div>
      </Modal>
    </>
  );
};
export default DistThresholdHelp;
