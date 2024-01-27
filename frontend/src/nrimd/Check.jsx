import React, { useState,useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import Checking from './components/result_components/CheckingLogo.jsx';

export default function Check() {
  const [ifChecking,setIfChecking] = useState(false);
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(
    ()=>{
      if(location.state !== null){
        message.error(location.state.message)
        form.setFieldsValue({JobID:location.state.jobid})
      }
    },[])


  const onFinish = (values) => {
    setIfChecking(true)
        setTimeout(
        ()=>{
            navigate('/result/'+values.JobID, {state:{"jobid":values.JobID}})
        }
        ,1000
        )
    }

  function CheckForm(){
      const layout = {labelCol: { span: 8, }, wrapperCol: { span: 8,}, };
      return <>
        <Form {...layout}  onFinish={onFinish} form={form} style={{marginTop:'10vh'}}>
          <Form.Item name="JobID" label="Job ID" rules={[{ required: true, },]}>
              <Input /> 
          </Form.Item>
          <Form.Item  wrapperCol={{...layout.wrapperCol, offset: 11,}}>
              <Button type="primary" htmlType="submit" style={{backgroundColor:"#112264", fontWeight:"bold"}}> Submit </Button>
          </Form.Item>
        </Form>
      </>
  }
  return (
    <div>
      <Checking ifChecking ={ifChecking} />
      {CheckForm()}
    </div>
  )
}
