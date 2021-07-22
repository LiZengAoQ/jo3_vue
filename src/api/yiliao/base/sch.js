import request from '@/utils/request'

// 查询基础服务_排班 v1.3.2 A列表
export function listSch(query) {
  return request({
    url: '/api/system/sch/list',
    method: 'get',
    params: query
  })
}

// 查询基础服务_排班 v1.3.2 A详细
export function getSch(schId) {
  return request({
    url: '/api/system/sch/' + schId,
    method: 'get'
  })
}

// 新增基础服务_排班 v1.3.2 A
export function addSch(data) {
  return request({
    url: '/api/system/sch',
    method: 'post',
    data: data
  })
}

// 修改基础服务_排班 v1.3.2 A
export function updateSch(data) {
  return request({
    url: '/api/system/sch',
    method: 'put',
    data: data
  })
}

// 删除基础服务_排班 v1.3.2 A
export function delSch(schId) {
  return request({
    url: '/api/system/sch/' + schId,
    method: 'delete'
  })
}

// 导出基础服务_排班 v1.3.2 A
export function exportSch(query) {
  return request({
    url: '/api/system/sch/export',
    method: 'get',
    params: query
  })
}