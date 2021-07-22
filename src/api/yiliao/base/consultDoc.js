import request from '@/utils/request'

// 查询医生列表
export function listconsult(query) {
  return request({
    url: '/api/consultdoc/list',
    method: 'get',
    params: query
  })
}

// 查询详情
export function getConsultDocService(docId,svcId) {
  return request({
    url: '/api/consultdoc/service/'+docId+'/'+svcId,

    method: 'get'
  })
}

// 查询详情
export function getConsultDocId(id) {
  return request({
    url: '/api/consultdoc/ ' + id,
    method: 'get'
  })
}

// 查询详情
export function addDocInfoService(data) {
  return request({
    url: '/api/consultdoc/service/add',
    method: 'post',
    data: data
  })
}

// 查询医院下拉列表
export function getconsulthos() {
  return request({
    url: '/api/consultdoc/hos',
    method: 'get'
  })
}

// 查询科室下拉列表
export function getconsultdept() {
  return request({
    url: '/api/consultdoc/dept',
    method: 'get'
  })
}

// 添加推荐
export function addconsult(data) {
  return request({
    url: '/api/consultdoc',
    method: 'post',
    data: data
  })
}

// 修改是否启用
export function updateconsultq(data) {
  return request({
    url: '/api/consultdoc/updates',
    method: 'put',
    data: data
  })
}

// 修改是否推荐
export function updateconsultt(data) {
  return request({
    url: '/api/consultdoc/updates' ,
    method: 'put',
    data: data
  })
}

// 修改是否推荐
export function updateFgreCommend(data) {
    return request({
        url: '/api/consultdoc/updateFgreCommend' ,
        method: 'put',
        data: data
    })
}

// 修改服务
export function updateconsultservice(data) {
  return request({
    url: '/api/consultdoc/service/upd',
    method: 'put',
    data: data
  })
}

// 取消排序
export function delconsultdoc(data) {
  return request({
    url: '/api/consultdoc/del',
    method: 'put',
    data: data
  })
}

// 导出
export function exportconsult(query) {
  return request({
    url: '/api/consultdoc/export',
    method: 'get',
    params: query
  })
}
