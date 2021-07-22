import request from '@/utils/request'

// 查询资讯_模块列表
export function listNewsModule(query) {
  return request({
    url: '/api/newsModule/list',
    method: 'get',
    params: query
  })
}

// 查询资讯_模块详细
export function getNewsModule(id) {
  return request({
    url: '/api/newsModule/' + id,
    method: 'get'
  })
}

// 新增资讯_模块
export function addNewsModule(data) {
  return request({
    url: '/api/newsModule',
    method: 'post',
    data: data
  })
}

// 修改资讯_模块
export function updateNewsModule(data) {
  return request({
    url: '/api/newsModule',
    method: 'put',
    data: data
  })
}

// 删除资讯_模块
export function delNewsModule(id) {
  return request({
    url: '/api/newsModule/' + id,
    method: 'delete'
  })
}

// 导出资讯_模块
export function exportNewsModule(query) {
  return request({
    url: '/api/newsModule/export',
    method: 'get',
    params: query
  })
}