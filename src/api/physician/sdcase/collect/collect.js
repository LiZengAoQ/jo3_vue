import request from '@/utils/request'

// 查询3d病例扩展，收藏列表
export function listCollect(query) {
  return request({
    url: '/api/collect/list',
    method: 'get',
    params: query
  })
}

// 查询3d病例扩展，收藏详细
export function getCollect(collectId) {
  return request({
    url: '/api/collect/' + collectId,
    method: 'get'
  })
}

// 新增3d病例扩展，收藏
export function addCollect(data) {
  return request({
    url: '/api/collect',
    method: 'post',
    data: data
  })
}

// 修改3d病例扩展，收藏
export function updateCollect(data) {
  return request({
    url: '/api/collect',
    method: 'put',
    data: data
  })
}

// 删除3d病例扩展，收藏
export function delCollect(collectId) {
  return request({
    url: '/api/collect/' + collectId,
    method: 'delete'
  })
}

// 导出3d病例扩展，收藏
export function exportCollect(query) {
  return request({
    url: '/api/collect/export',
    method: 'get',
    params: query
  })
}
