import { Modal, Button } from 'antd';
import React, { useState } from 'react';
import result_threshold from "../../assets/images/submit/result_threshold.png"
const VisualThresholdHelp = () => {
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
      <Modal title="How to set Viusalization Threshold:" closable={false} footer={null}  open={isModalOpen} okText={false} cancelText={false} onCancel={handleCancel} width={1000}>
        <div>
            Viusalization Threshold is the threshold to visualize inferred interactions:
            <ul>
            <li>
            if the inferred interaction between two residues is greater than the threshold, it will be shown in the Heatmap.
            </li>
            <li>
            the purpose of the setting is to make key interactions more clearly visible in the result heatmap.
            </li>
            <li>
            if user don't set it, we will use default value 0.5 to visualize.
            </li>
            </ul>
        </div> 
        <div>
        In the following, the Visualization Threshold are set as 0.1 and 0.9 respectively:
        </div>
        <img src={result_threshold} style={{width:"80%"}}></img>
        <div>
        It can be found that the greater the threshold setting, the more clearly the key role is demonstrated, but the interactions below the threshold is not shown.
        </div>
        <div>
        It doesn't matter if you don't know how to set the right value, we also afford the setting in the result page, so user can modify the threshold value to get the desired heatmap.
        </div>
	<div style={{textAlign:"right"}}><Button type="primary" onClick={handleCancel}>Close</Button></div>
      </Modal>
    </>
  );
};
export default VisualThresholdHelp;
