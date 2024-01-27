import React, { useState,useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';

export default function CheckForm(props) {
  const { id } = useParams() //gain url id
  console.log(id);
  const [form] = Form.useForm()
  useEffect(
    ()=>{
      if(id !== null && id!=undefined){
        form.setFieldsValue({JobID:id})
      }
    },[])

  function SearchingForm(){
      const layout = {labelCol: { span: 8, }, wrapperCol: { span: 8,}, };
      return <>
        <Form {...layout}  form={form} style={{marginTop:'10vh'}}>
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
      {SearchingForm()}
    </div>
  )
}

