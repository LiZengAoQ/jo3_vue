import request from '@/utils/request'

// 查询医生推荐列表
export function listDocRecommend(query) {
  return request({
    url: '/api/doc/recommend/list',
    method: 'get',
    params: query
  })
}

// 新增楼层导航
export function addDocRecommend(data) {
  return request({
    url: '/api/floor',
    method: 'post',
    data: data
  })
}

// 查询修改信息列表
export function getDocRecommend(id) {
  return request({
    url: '/api/doc/recommend/selectOne/'+id,
    method: 'get'
  })
}

// 修改
export function updateDocRecommend(data) {
  return request({
    url: '/api/doc/recommend/update',
    method: 'put',
    data: data
  })
}

// 伪新增（修改医生推荐）
export function updateDocRecommendById(data) {
  return request({
    url: '/api/doc/recommend/updateIds',
    method: 'put',
    data: data
  })
}

// 导出
export function exportDocRecommend(query) {
  return request({
    url: '/api/doc/recommend/export',
    method: 'get',
    params: query
  })
}

//查询所属医院列表
export function getHosNameList(query) {
  return request({
    url: '/api/doc/recommend/hosNameList',
    method: 'get',
    params: query,
  })
}

//查询所属科室列表
export function getDeptNameList(query) {
  return request({
    url: '/api/doc/recommend/deptNameList',
    method: 'get',
    params: query,
  })
}
