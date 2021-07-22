import request from '@/utils/request'

// 查询省市区列表
export function listArea(query) {
  return request({
    url: '/system/area/list',
    method: 'get',
    params: query
  })
}

// 查询省市区详细
// export function selectAreaById(id) {
//   return request({
//     url: '/system/area/' + id,
//     method: 'get'
//   })
// }

export function selectAreaById(id) {
  return request({
    url: '/system/area/selectAreaById/'+id,
    method: 'get'
  })
}

// export function selectAreaById(id){
//   return request({
//     url: '/system/area/selectDictionaryById/' + id,
//     method: 'get'
//   })
// }

// 新增省市区
export function addArea(data) {
  return request({
    url: '/system/area',
    method: 'post',
    data: data
  })
}

export function clearCache() {
  return request({
    url: '/system/area/clearCache',
    method: 'delete'
  })
}

export function getDictionarys(dictType) {
  return request({
    url: '/system/area/type/' + dictType,
    method: 'get'
  })
}

// 修改省市区
export function updateArea(data) {
  return request({
    url: '/system/area',
    method: 'put',
    data: data
  })
}

// 删除省市区
export function delArea(id) {
  return request({
    url: '/system/area/' + id,
    method: 'delete'
  })
}

// 导出省市区
export function exportArea(query) {
  return request({
    url: '/system/area/export',
    method: 'get',
    params: query
  })
}