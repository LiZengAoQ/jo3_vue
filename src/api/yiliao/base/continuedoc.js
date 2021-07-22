import request from '@/utils/request'

// 查询续方列表
export function listcontinuedoctor(query) {
  return request({
    url: '/api/continuedoc/continuedoclist',
    method: 'get',
    params: query
  })
}

// 查询列表
export function listcontinuedoc(query) {
  return request({
    url: '/api/continuedoc/list',
    method: 'get',
    params: query
  })
}


// 查询详细医生
export function getcontinuedoc(id) {
  return request({
    url: '/api/continuedoc/' + id ,
    method: 'get'
  })
}


// 查询详细医院列表
export function getcontinuedochos() {
  return request({
    url: '/api/continuedoc/hos' ,
    method: 'get'
  })
}

// 查询详细科室列表
export function getcontinuedocdept() {
  return request({
    url: '/api/continuedoc/dept' ,
    method: 'get'
  })
}

// 添加推荐
export function addcontinuedoc(data) {
  return request({
    url: '/api/continuedoc',
    method: 'post',
    data: data
  })
}


// 删除信息
export function delcontinuedoc(id) {
  return request({
    url: '/api/continuedoc/del/' + id,
    method: 'delete'
  })
}
