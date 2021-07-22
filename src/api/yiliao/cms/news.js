import request from '@/utils/request'

// 查询资讯列表
export function listNews(query) {
  return request({
    url: '/api/system/news/list',
    method: 'get',
    params: query
  })
}
// 查询资讯列表
export function listNewss(query) {
  return request({
    url: '/api/system/news/lists',
    method: 'get',
    params: query
  })
}


// 查询资讯详细
export function getNews(id) {
  return request({
    url: '/api/system/news/' + id,
    method: 'get'
  })
}

// 新增资讯
export function addNews(data) {
  return request({
    url: '/api/system/news',
    method: 'post',
    data: data
  })
}

// 修改资讯
export function updateNews(data) {
  return request({
    url: '/api/system/news',
    method: 'put',
    data: data
  })
}

// 删除资讯
export function delNews(id) {
  return request({
    url: '/api/system/news/' + id,
    method: 'delete'
  })
}

// 导出资讯
export function exportNews(query) {
  return request({
    url: '/api/system/news/export',
    method: 'get',
    params: query
  })
}
