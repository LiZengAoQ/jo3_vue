import request from '@/utils/request'

// 查询疾病诊断列表
export function listDiagnosis(query) {
  return request({
    url: '/api/diagnosis/list',
    method: 'get',
    params: query
  })
}

// 查询疾病诊断详细
export function getDiagnosis(id) {
  return request({
    url: '/api/diagnosis/' + id,
    method: 'get'
  })
}

// 新增疾病诊断
export function addDiagnosis(data) {
  return request({
    url: '/api/diagnosis',
    method: 'post',
    data: data
  })
}

// 修改疾病诊断
export function updateDiagnosis(data) {
  return request({
    url: '/api/diagnosis',
    method: 'put',
    data: data
  })
}

// 删除疾病诊断
export function delDiagnosis(id) {
  return request({
    url: '/api/diagnosis/' + id,
    method: 'delete'
  })
}

// 导出疾病诊断
export function exportDiagnosis(query) {
  return request({
    url: '/api/diagnosis/export',
    method: 'get',
    params: query
  })
}