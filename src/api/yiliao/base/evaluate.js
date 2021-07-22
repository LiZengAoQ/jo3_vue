import request from '@/utils/request'

// 查询评价业务列表
export function listEvaluate(query) {
  return request({
    url: '/api/evaluate/list',
    method: 'get',
    params: query
  })
}

// 查询评价业务详细
export function getEvaluate(id) {
  return request({
    url: '/api/evaluate/' + id,
    method: 'get'
  })
}

// 新增评价业务
export function addEvaluate(data) {
  return request({
    url: '/api/evaluate',
    method: 'post',
    data: data
  })
}

// 修改评价业务
export function updateEvaluate(data) {
  return request({
    url: '/api/evaluate',
    method: 'put',
    data: data
  })
}

// 删除评价业务
export function delEvaluate(id) {
  return request({
    url: '/api/evaluate/' + id,
    method: 'delete'
  })
}

// 导出评价业务
export function exportEvaluate(query) {
  return request({
    url: '/api/evaluate/export',
    method: 'get',
    params: query
  })
}
