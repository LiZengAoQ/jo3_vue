import request from '@/utils/request'

// 查询字典列表
export function listDictionary(query) {
  return request({
    url: '/system/dictionary/list',
    method: 'get',
    params: query
  })
}

// 查询字典详细
export function getDictionary(id) {
  return request({
    url: '/system/dictionary/' + id,
    method: 'get'
  })
}

export function selectDictionaryById(id){
  return request({
    url: '/system/dictionary/selectDictionaryById/' + id,
    method: 'get'
  })
}

// 新增字典
export function addDictionary(data) {
  return request({
    url: '/system/dictionary',
    method: 'post',
    data: data
  })
}

export function clearCache() {
  return request({
    url: '/system/dictionary/clearCache',
    method: 'delete'
  })
}

export function getDictionarys(dictType) {
  return request({
    url: '/system/dictionary/type/' + dictType,
    method: 'get'
  })
}

// 修改字典
export function updateDictionary(data) {
  return request({
    url: '/system/dictionary',
    method: 'put',
    data: data
  })
}

export function updateDictionaryEditPermission(data) {
  return request({
    url: '/system/dictionary/editPermission',
    method: 'put',
    data: data
  })
}

// 删除字典
export function delDictionary(id) {
  return request({
    url: '/system/dictionary/' + id,
    method: 'delete'
  })
}

// 导出字典
export function exportDictionary(query) {
  return request({
    url: '/system/dictionary/export',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/dictionary/importTemplate',
    method: 'get'
  })
}
