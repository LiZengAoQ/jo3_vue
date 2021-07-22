import request from '@/utils/request'

// 查询预约订单信息.列表
export function listOrder(query) {
  return request({
    url: '/api/order/list',
    method: 'get',
    params: query
  })
}

// 查询预约订单信息.详细
export function getOrder(orderId) {
  return request({
    url: '/api/order/' + orderId,
    method: 'get'
  })
}

// 新增预约订单信息.
export function addOrder(data) {
  return request({
    url: '/api/order',
    method: 'post',
    data: data
  })
}

// 修改预约订单信息.
export function updateOrder(data) {
  return request({
    url: '/api/order',
    method: 'put',
    data: data
  })
}

// 删除预约订单信息.
export function delOrder(orderId) {
  return request({
    url: '/api/order/' + orderId,
    method: 'delete'
  })
}

// 导出预约订单信息.
export function exportOrder(query) {
  return request({
    url: '/api/order/export',
    method: 'get',
    params: query
  })
}