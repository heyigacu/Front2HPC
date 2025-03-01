import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';


export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div>
      <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary" onClick={()=>{navigate('/introduction/')}}>Back Home</Button>}
      />
    </div>
  )
}
