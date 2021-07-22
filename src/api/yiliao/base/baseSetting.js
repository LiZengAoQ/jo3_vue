import request from '@/utils/request'

// 查询系统_广告_设置列表
export function listSetting(query) {
  return request({
    url: '/api/system/setting/list',
    method: 'get',
    params: query
  })
}

// 查询系统_广告_设置详细
export function getSetting(id) {
  return request({
    url: '/api/system/setting/' + id,
    method: 'get'
  })
}

// 新增系统_广告_设置
export function addSetting(data) {
  return request({
    url: '/api/system/setting',
    method: 'post',
    data: data
  })
}

// 修改系统_广告_设置
export function updateSetting(data) {
  return request({
    url: '/api/system/setting',
    method: 'put',
    data: data
  })
}

// 删除系统_广告_设置
export function delSetting(id) {
  return request({
    url: '/api/system/setting/' + id,
    method: 'delete'
  })
}

// 导出系统_广告_设置
export function exportSetting(query) {
  return request({
    url: '/api/system/setting/export',
    method: 'get',
    params: query
  })
}