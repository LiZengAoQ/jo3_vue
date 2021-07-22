import request from '@/utils/request'

// 查询列表
export function listDoctors(query) {
  return request({
    url: '/api/doctors/list',
    method: 'get',
    params: query
  })
}


// 查询详细
export function getDoctors(id) {
  return request({
    url: '/api/doctors/selectid' + id ,
    method: 'get'
  })
}

// 添加
export function addDoctors(data) {
  return request({
    url: '/api/doctors',
    method: 'post',
    data: data
  })
}

// 修改
export function updatedoctors(data) {
  return request({
    url: '/api/doctors/upd',
    method: 'put',
    data: data
  })
}


