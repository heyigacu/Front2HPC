import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';


export default function Error() {
  const navigate = useNavigate()
  return (
    <div>
      <Result
          status="500"
          title="500"
          subTitle="parameter error, please check your parameter and resubmit your job"
          extra={<Button type="primary" onClick={()=>{navigate('/introduction/')}}>Back Home</Button>}
      />
    </div>
  )
}
