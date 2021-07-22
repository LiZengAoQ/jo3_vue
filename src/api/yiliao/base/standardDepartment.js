import request from '@/utils/request'

// 查询一级科室列表
export function listStandardDepartment(query) {
  return request({
    url: '/api/standardDepartment/listByFirstLevel',
    method: 'get',
    params: query
  })
}

// 查询某一级科室下的二级科室列表
export function getSecondLevelListByFirstCode(query) {
  return request({
    url: '/api/standardDepartment/secondLevelListByFirstCode',
    method: 'get',
    params: query,
  })
}

// 新增一级科室
export function addStandardDepartmentOne(data) {
  return request({
    url: '/api/standardDepartment/addOne',
    method: 'post',
    data: data
  })
}

// 新增二级科室
export function addStandardDepartmentTwo(data) {
  return request({
    url: '/api/standardDepartment/addTwo',
    method: 'post',
    data: data
  })
}

// 修改中心/标准科室.
export function updateStandardDepartment(data) {
  return request({
    url: '/api/standardDepartment',
    method: 'put',
    data: data
  })
}

// 删除中心/标准科室.
export function delStandardDepartment(deptCode) {
  return request({
    url: '/api/standardDepartment/' + deptCode,
    method: 'delete'
  })
}

// 导出中心/标准科室.
export function exportStandardDepartment(query) {
  return request({
    url: '/api/standardDepartment/export',
    method: 'get',
    params: query
  })
}
