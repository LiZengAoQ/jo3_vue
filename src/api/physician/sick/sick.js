import request from '@/utils/request'

// 查询患者个人信息列表
export function listSick(query) {
  return request({
    url: '/api/sick/list',
    method: 'get',
    params: query
  })
}

// 查询患者个人信息详细
export function getSick(id) {
  return request({
    url: '/api/sick/' + id,
    method: 'get'
  })
}

// 新增患者个人信息
export function addSick(data) {
  return request({
    url: '/api/sick',
    method: 'post',
    data: data
  })
}

// 修改患者个人信息
export function updateSick(data) {
  return request({
    url: '/api/sick',
    method: 'put',
    data: data
  })
}

// 删除患者个人信息
export function delSick(id) {
  return request({
    url: '/api/sick/' + id,
    method: 'delete'
  })
}

// 导出患者个人信息
export function exportSick(query) {
  return request({
    url: '/api/sick/export',
    method: 'get',
    params: query
  })
}
