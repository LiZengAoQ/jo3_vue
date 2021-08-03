import request from '@/utils/request'

// 查询3d病例扩展，点赞列表
export function listLike(query) {
  return request({
    url: '/api/like/list',
    method: 'get',
    params: query
  })
}

// 查询3d病例扩展，点赞详细
export function getLike(likeId) {
  return request({
    url: '/api/like/' + likeId,
    method: 'get'
  })
}

// 新增3d病例扩展，点赞
export function addLike(data) {
  return request({
    url: '/api/like',
    method: 'post',
    data: data
  })
}

// 修改3d病例扩展，点赞
export function updateLike(data) {
  return request({
    url: '/api/like',
    method: 'put',
    data: data
  })
}

// 删除3d病例扩展，点赞
export function delLike(likeId) {
  return request({
    url: '/api/like/' + likeId,
    method: 'delete'
  })
}

// 导出3d病例扩展，点赞
export function exportLike(query) {
  return request({
    url: '/api/like/export',
    method: 'get',
    params: query
  })
}
