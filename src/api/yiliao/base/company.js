import request from '@/utils/request'

// 查询快递信息列表
export function listCompany(query) {
  return request({
    url: '/api/company/list',
    method: 'get',
    params: query
  })
}

// 查询快递信息详细
export function getCompany(companyCode) {
  return request({
    url: '/api/company/' + companyCode,
    method: 'get'
  })
}

// 新增快递信息
export function addCompany(data) {
  return request({
    url: '/api/company',
    method: 'post',
    data: data
  })
}

// 修改快递信息
export function updateCompany(data) {
  return request({
    url: '/api/company',
    method: 'put',
    data: data
  })
}

// 删除快递信息
export function delCompany(companyCode) {
  return request({
    url: '/api/company/' + companyCode,
    method: 'delete'
  })
}

// 导出快递信息
export function exportCompany(query) {
  return request({
    url: '/api/company/export',
    method: 'get',
    params: query
  })
}
