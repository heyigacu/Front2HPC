import { Button, Result } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
const SubmitFailed = () => (
  <Result
    status="warning"
    title="There are some problems with your operation."
    extra={
    <Button key="buy" onClick={()=>window.history.go(0)}>Submit Again</Button>
    }
  />
);
export default SubmitFailed