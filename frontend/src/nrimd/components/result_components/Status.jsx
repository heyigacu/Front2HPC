import React from 'react';
import { Button, Table } from 'antd';
import CheckForm from './CheckForm';

export default function Status(props) {
	    const columns = [
		            {title: 'Job Id', dataIndex: 'jobid', key: 'jobid'},
		            {title: 'Create Time', dataIndex: 'time', key: 'time'},
		            {title: 'Status', key: 'status', dataIndex: 'status'},
		            {title: 'Device', key: 'device', dataIndex: 'device'},
		        ];
	    return (
		            <>
		                {
					                props.table== undefined ?
					                <CheckForm JobID={props.JobID}/>
					                :
					                <>
					                <div style={{ marginBottom: "10px" }}>
					                    The job status will fresh every 1 minutes   
					                    <Button type="primary" style={{backgroundColor:"#112264", fontWeight:"bold", color:"white", marginLeft:"1%"}} onClick={() =>{props.setJobStatus("Searching")}}>refresh</Button>
					                </div>
					                <Table columns={columns} dataSource={props.table} pagination={false} />
					                </>
					                
					            }
		                
		            </>
		        )
}


