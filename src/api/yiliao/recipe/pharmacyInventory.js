import request from '@/utils/request'

// 查询列表
export function listPharmacyInventory(query) {
  return request({
    url: '/api/recipe/pharmacy/inventory/list',
    method: 'get',
    params: query
  })
}

//查询医院列表
export function getHosList() {
  return request({
    url: '/api/recipe/pharmacy/inventory/listByHos',
    method: 'get',
  })
}

// 修改
export function updateFgHave(data) {
  return request({
    url: '/api/recipe/pharmacy/inventory/update',
    method: 'put',
    data: data
  })
}
