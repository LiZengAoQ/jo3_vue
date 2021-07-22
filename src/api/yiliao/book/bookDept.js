import request from '@/utils/request'

// 查询医院科室信息列表
export function listBookDept(query) {
  return request({
    url: '/api/bookDept/list',
    method: 'get',
    params: query
  })
}

// 查询医院科室信息详细
export function getBookDept(deptId) {
  return request({
    url: '/api/bookDept/' + deptId,
    method: 'get'
  })
}

// 新增医院科室信息
export function addBookDept(data) {
  return request({
    url: '/api/bookDept',
    method: 'post',
    data: data
  })
}

// 修改医院科室信息
export function updateBookDept(data) {
  return request({
    url: '/api/bookDept',
    method: 'put',
    data: data
  })
}

// 删除医院科室信息
export function delBookDept(deptId) {
  return request({
    url: '/api/bookDept/' + deptId,
    method: 'delete'
  })
}

// 导出医院科室信息
export function exportBookDept(query) {
  return request({
    url: '/api/bookDept/export',
    method: 'get',
    params: query
  })
}