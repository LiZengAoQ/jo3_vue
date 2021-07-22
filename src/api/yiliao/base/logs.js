import request from '@/utils/request'

// 查询敏感词日志记录列表
export function listLog(query) {
  return request({
    url: 'api/base/sensitiveLogs/list',
    method: 'get',
    params: query
  })
}

// 查询敏感词日志记录详细
export function getLog(id) {
  return request({
    url: 'api/base/sensitiveLogs/' + id,
    method: 'get'
  })
}

// 查询敏感词日志记录详细
export function getSensitiveLogConsult(id) {
  return request({
    url: 'api/base/sensitiveLogs/sensitiveLogConsult/' + id,
    method: 'get'
  })
}

// 新增敏感词日志记录
export function addLog(data) {
  return request({
    url: 'api/base/sensitiveLogs',
    method: 'post',
    data: data
  })
}

// 修改敏感词日志记录
export function updateLog(data) {
  return request({
    url: 'api/base/sensitiveLogs',
    method: 'put',
    data: data
  })
}

// 删除敏感词日志记录
export function delLog(id) {
  return request({
    url: 'api/base/sensitiveLogs/' + id,
    method: 'delete'
  })
}

// 导出敏感词日志记录
export function exportLog(query) {
  return request({
    url: 'api/base/sensitiveLogs/export',
    method: 'get',
    params: query
  })
}
