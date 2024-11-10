import { useState } from "react";
import { Table, Button, Modal, Form, message, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import { Link } from 'react-router-dom';
import { missionState, missionPriority } from '@/config/enum';
import '@/mock';
import TaskModal from "@/components/Modal";
import './index.less';
import useAntdTable from '@/hooks/useAntdTable';
const { confirm } = Modal;
const initValues = {
  state: '',
  priority: '',
}
const Home = () => {
  const [visible, setVisible] = useState(false);
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState(initValues);
  const fetchData = async (params) => {
    const res = await axios.get('/api/tasks', {
      params: { ...queryParams, ...params }
    });
    return {
      total: res?.data?.total,
      data: res?.data?.data || [],
  };
  }
  const { tableProps, resetTable } = useAntdTable(fetchData, [
    queryParams,
  ]);
  const handleVisible = (flag) => {
    setVisible(flag);
  }
  const deleteMission = (key) => {
    confirm({
      title: '确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: '此操作将不可恢复',
      async onOk() {
        const res = await axios.post('/api/tasks/delete', {key});
        if(res.data.code === 0) {
          message.success('删除成功');
          fetchData();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <Link to={`/detail/${record.key}`}>{text}</Link>
      }
    },
    {
      title: '任务状态',
      dataIndex: 'state',
      key: 'state',
      sorter: (a, b) => a.state - b.state,
      render: (text, record) => {
        return missionState[text] || '-'
      }
    },
    {
      title: '任务优先级',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority - b.priority,
      render: (text, record) => {
        return missionPriority[text] || '-'
      }
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return <Button type="link" onClick={deleteMission.bind(null, record.key)}>删除</Button>
      }
    },
  ];

  const handleSubmit = () => {
    searchForm.submit();
  }

  const finishSearchForm = (values) => {
    setQueryParams({ ...queryParams, ...values })
  }

  // 重置
  const handleReset = async () => {
    setQueryParams(initValues);
    searchForm.resetFields();
    resetTable();
  };
  
  return <div className="homeContainer">
    <div className="formContainer">
        <Form form={searchForm} layout="inline" onFinish={finishSearchForm}>
          <Form.Item label="名称" name="name">
            <Input placeholder="请输入任务名称" onClear/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>提交</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleReset}>重置</Button>
          </Form.Item>
        </Form>
      <Button type="primary" onClick={() => handleVisible(true)}>创建任务</Button>
    </div>
    <Table columns={columns} scroll={{y: 'calc(100vh - 210px)'}} {...tableProps}/>
    <TaskModal visible={visible} handleVisible={handleVisible} fetchData={fetchData}/>
  </div>;
};
export default Home;