import request from '@/utils/request'

// 查询医生列表
export function listhotDoctor(query) {
  return request({
    url: '/api/hotdoctor/list',
    method: 'get',
    params: query
  })
}

// 查询添加列表
export function listhotDoctoradd(query) {
  return request({
    url: '/api/hotdoctor/listadd',
    method: 'get',
    params: query
  })
}

// 查询详细医生
export function gethotdoctor(id) {
  return request({
    url: '/api/hotdoctor/' + id ,
    method: 'get'
  })
}
// 查询详细医院列表
export function gethotdoctorhos() {
  return request({
    url: '/api/hotdoctor/hos' ,
    method: 'get'
  })
}

// 查询详细科室列表
export function gethotdoctordept() {
  return request({
    url: '/api/hotdoctor/dept' ,
    method: 'get'
  })
}

// 添加推荐
export function addhotdoctor(data) {
  return request({
    url: '/api/hotdoctor',
    method: 'post',
    data: data
  })
}

// 修改推荐排序
export function updatehotdoctor(data) {
  return request({
    url: '/api/hotdoctor/upd',
    method: 'put',
    data: data
  })
}

// 取消排序
export function delhotdoctor(id) {
  return request({
    url: '/api/hotdoctor/' + id,
    method: 'put'
  })
}

// 导出
// export function exporthotdoctor(query) {
//   return request({
//     url: '/api/hotdoctor/export',
//     method: 'get',
//     params: query
//   })
// }
