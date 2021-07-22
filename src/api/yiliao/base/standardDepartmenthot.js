import request from '@/utils/request'

// 查询热门标准科室列表
export function listStandardDepartmenthot(query) {
  return request({
    url: '/system/standardDepartmenthot/list',
    method: 'get',
    params: query
  })
}

// 查询热门标准科室详细
export function getStandardDepartmenthot(id) {
  return request({
    url: '/system/standardDepartmenthot/' + id,
    method: 'get'
  })
}

// 新增热门标准科室
export function addStandardDepartmenthot(data) {
  return request({
    url: '/system/standardDepartmenthot',
    method: 'post',
    data: data
  })
}

// 修改热门标准科室
export function updateStandardDepartmenthot(data) {
  return request({
    url: '/system/standardDepartmenthot',
    method: 'put',
    data: data
  })
}

// 删除热门标准科室
export function delStandardDepartmenthot(id) {
  return request({
    url: '/system/standardDepartmenthot/' + id,
    method: 'delete'
  })
}

// 导出热门标准科室
export function exportStandardDepartmenthot(query) {
  return request({
    url: '/system/standardDepartmenthot/export',
    method: 'get',
    params: query
  })
}