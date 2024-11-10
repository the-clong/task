import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";
import { missionState, missionPriority } from '@/config/enum';
import axios from "axios";
import { useParams } from 'react-router-dom';
import './index.less';
const Detail = () => {
  const params = useParams();
  const [detail, setDetail] = useState([
    {
      key: '1',
      label: '名称',
      children: null,
    },
    {
      key: '2',
      label: '状态',
      children: null,
    },
    {
      key: '3',
      label: '优先级',
      children: null,
    },
  ]);
  useEffect(() => {
    getTaskDetail();
  }, []);
  const getTaskDetail = async () => {
    console.log('params-------', params);
    const res = await axios.post('/api/tasks/find', params);
    console.log('getTaskDetail-----', res);
    const { name, state, priority } = res.data.data[0];
    const copyDetail = detail.slice(0);
    copyDetail[0].children = name;
    copyDetail[1].children = missionState[state];
    copyDetail[2].children = missionPriority[priority]
    setDetail([...copyDetail])
  }
  return <div className="homeDetail"><Descriptions title="任务详情" items={detail} /></div>
}
export default Detail;