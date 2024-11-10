import React from "react";
import { Modal, Form, Input, Select, message } from 'antd';
import { missionState, missionPriority } from '@/config/enum';
import axios from "axios";
const { Option } = Select;
const TaskModal = (props) => {
  const { visible, handleVisible, fetchData } = props;
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  }

  const addTasksData = async (values) => {
    const res = await axios.post('/api/tasks/add', values);
    if(res.data.code === 0) {
      message.success('添加成功');
      fetchData();
      handleVisible(false);
    }
  }

  const onFinish = (values) => {
    addTasksData(values);
  }

  const handleCancel = () => {
    handleVisible(false)
  }
  return <Modal title="创建任务" open={visible} onOk={handleOk} onCancel={handleCancel}>
  <Form
  form={form}
  name="missionForm"
  labelCol={{ span: 6 }}
  wrapperCol={{ span: 18 }}
  onFinish={onFinish}
>
  <Form.Item
    label="任务名称"
    name="name"
    rules={[{ required: true, message: '请输入任务名称' }]}
  >
    <Input placeholder="请输入任务名称"/>
  </Form.Item>

  <Form.Item name="state" label="任务状态" required rules={[{ required: true, message: '请选择状态' }]}>
    <Select
      placeholder="请选择任务状态"
    >
      {
        Object.keys(missionState).map((item) => (
          <Option value={item}>{missionState[item]}</Option>
        ))
      }
    </Select>
  </Form.Item>
  <Form.Item name="priority" label="加急状态" required rules={[{ required: true, message: '请选择状态' }]}>
    <Select
      placeholder="请选择加急状态"
    >
      {
        Object.keys(missionPriority).map((item) => (
          <Option value={item}>{missionPriority[item]}</Option>
        ))
      }
    </Select>
  </Form.Item>
</Form>
  </Modal>
}
export default TaskModal;