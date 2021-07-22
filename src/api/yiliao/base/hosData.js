import request from '@/utils/request'

// 查询医院信息列表
export function listHosData(query) {
  return request({
    url: '/api/hosData/list',
    method: 'get',
    params: query
  })
}

// 查询医院信息详细
export function getHosData(hosId) {
  return request({
    url: '/api/hosData/' + hosId,
    method: 'get'
  })
}

// 新增医院信息
export function addHosData(data) {
  return request({
    url: '/api/hosData',
    method: 'post',
    data: data
  })
}

// 修改医院信息
export function updateHosData(data) {
  return request({
    url: '/api/hosData',
    method: 'put',
    data: data
  })
}

// 删除医院信息
export function delHosData(hosId) {
  return request({
    url: '/api/hosData/' + hosId,
    method: 'delete'
  })
}

// 导出医院信息
export function exportHosData(query) {
  return request({
    url: '/api/hosData/export',
    method: 'get',
    params: query
  })
}