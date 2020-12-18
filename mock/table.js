const Mock = require('mockjs')


//创建mockjs的实例
const data = Mock.mock({
  'items|10': [{ //参数items表示要创建的随机数据的名称，即json的键，10表示数量
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'], //随机选取一个状态
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

//将查询数据随机方法设置为全局模块，供后边页面调用
module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
