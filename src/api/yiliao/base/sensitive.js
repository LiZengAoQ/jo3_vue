import request from '@/utils/request'

// 查询列表
export function listSensitives(query) {
  return request({
    url: '/api/base/sensitive/list',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getSensitives(id) {
  return request({
    url: '/api/base/sensitive/' + id,
    method: 'get'
  })
}

// 添加敏感词
export function addSensitives(data) {
  return request({
    url: '/api/base/sensitive',
    method: 'post',
    data: data
  })
}


// 删除敏感词
export function delSensitives(id) {
  return request({
    url: '/api/base/sensitive/' + id,
    method: 'delete'
  })
}

// 导出资讯
export function exportSensitives(query) {
  return request({
    url: '/api/base/sensitive/export',
    method: 'get',
    params: query
  })
}