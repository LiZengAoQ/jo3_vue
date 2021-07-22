import request from '@/utils/request'

// 查询启动页
export function listLaunch(query) {
  return request({
    url: '/api/base/LaunchPage/list',
    method: 'get',
    params: query
  })
}

// 查询
export function getSetting(id) {
  return request({
    url: '/api/base/LaunchPage/' + id,
    method: 'get'
  })
}

// 新增启动页
export function addLaunch(data) {
  return request({
    url: '/api/base/LaunchPage',
    method: 'post',
    data: data
  })
}

// 修改启动页
export function updateSetting(data) {
  return request({
    url: '/api/base/LaunchPage/setting',
    // url: '/api/system/setting',
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