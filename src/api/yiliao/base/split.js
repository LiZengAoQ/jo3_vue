import request from '@/utils/request'

// 查询分成管理列表
export function listSplit(query) {
  return request({
    url: 'api/base/split/list',
    method: 'get',
    params: query
  })
}

// 查询分成管理详细
export function getSplit(id) {
  return request({
    url: 'api/base/split/' + id,
    method: 'get'
  })
}

// 新增分成管理
export function addSplit(data) {
  return request({
    url: 'api/base/split',
    method: 'post',
    data: data
  })
}

// 修改分成管理
export function updateSplit(data) {
  return request({
    url: 'api/base/split',
    method: 'put',
    data: data
  })
}

// 删除分成管理
export function delSplit(id) {
  return request({
    url: 'api/base/split/' + id,
    method: 'delete'
  })
}

// 导出分成管理
export function exportSplit(query) {
  return request({
    url: 'api/base/split/export',
    method: 'get',
    params: query
  })
}
