import request from '@/utils/request'

// 查询3d病例列表
export function listSdcase(query) {
  return request({
    url: '/api/sdcase/list',
    method: 'get',
    params: query
  })
}

// 查询3d病例详细
export function getSdcase(id) {
  return request({
    url: '/api/sdcase/' + id,
    method: 'get'
  })
}

// 新增3d病例
export function addSdcase(data) {
  return request({
    url: '/api/sdcase',
    method: 'post',
    data: data
  })
}

// 修改3d病例
export function updateSdcase(data) {
  return request({
    url: '/api/sdcase',
    method: 'put',
    data: data
  })
}

// 删除3d病例
export function delSdcase(id) {
  return request({
    url: '/api/sdcase/' + id,
    method: 'delete'
  })
}

// 导出3d病例
export function exportSdcase(query) {
  return request({
    url: '/api/sdcase/export',
    method: 'get',
    params: query
  })
}
