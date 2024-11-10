import Mock from 'mockjs';
// 数据源
const mockData = Mock.mock({
  "data|30": [{
    'key|+1': 1,
    name: '@name',
    state: '@integer(0, 2)',
    priority: '@integer(0, 2)',
  }]
})
Mock.mock('/api/tasks/find', 'post', (res) => {
  const key = JSON.parse(res.body).key;
  console.log('res111------', key, mockData.data);
  const item = mockData.data.filter(item => {
    return `${item.key}` === key;
  });
  return {
    code: 0,
    message: '查找成功',
    success: true,
    data: item,
  }
});
Mock.mock('/api/tasks/add', 'post', (res) => {
  mockData.data.push(JSON.parse(res.body));
  return {
    code: 0,
    message: '添加成功',
    success: true,
  }
});
Mock.mock('/api/tasks/delete', 'post', (res) => {
  const bodyData = JSON.parse(res.body);
  const index = mockData.data.findIndex(item => item.key === bodyData.key);
  mockData.data.splice(index, 1);
  return {
    code: 0,
    message: '删除成功',
    success: true,
  }
});
Mock.mock(/api\/tasks.*?/,(res) => {
  const signIndex = res.url.lastIndexOf('?');
  const params = new URLSearchParams(res.url.slice(signIndex));
  const name = params.get('name');
  const pageNum = params.get('pageNum');
  const pageSize = params.get('pageSize');
  const handleData = mockData.data.filter(item => {
    let flag = true;
    if(name) {
      flag = (flag && (item.name.indexOf(name) > -1));
    }
    return flag;
  });
  // 处理分页
  const resData = handleData.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  return {
    code: 200,
    success: true,
    ...{ data: resData, total: mockData.data.length },
  }
});
