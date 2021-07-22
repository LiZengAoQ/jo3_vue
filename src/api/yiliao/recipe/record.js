import request from '@/utils/request'

// 查询处方_价格变更记录列表
export function listRecord(query) {
  return request({
    url: '/api/record/list',
    method: 'get',
    params: query
  })
}

// 查询处方_价格变更记录详细
export function getRecord(id) {
  return request({
    url: '/api/record/' + id,
    method: 'get'
  })
}

// 新增处方_价格变更记录
export function addRecord(data) {
  return request({
    url: '/api/record',
    method: 'post',
    data: data
  })
}

// 修改处方_价格变更记录
export function updateRecord(data) {
  return request({
    url: '/api/record',
    method: 'put',
    data: data
  })
}

// 删除处方_价格变更记录
export function delRecord(id) {
  return request({
    url: '/api/record/' + id,
    method: 'delete'
  })
}

// 导出处方_价格变更记录
export function exportRecord(query) {
  return request({
    url: '/api/record/export',
    method: 'get',
    params: query
  })
}