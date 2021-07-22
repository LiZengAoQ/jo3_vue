import request from '@/utils/request'

// 查询楼层导航列表
export function listFloor(query) {
  return request({
    url: '/api/floor/list',
    method: 'get',
    params: query
  })
}

// 查询楼层导航详细
export function getFloor(id) {
  return request({
    url: '/api/floor/' + id,
    method: 'get'
  })
}

// 新增楼层导航
export function addFloor(data) {
  return request({
    url: '/api/floor',
    method: 'post',
    data: data
  })
}

// 修改楼层导航
export function updateFloor(data) {
  return request({
    url: '/api/floor',
    method: 'put',
    data: data
  })
}

// 删除楼层导航
export function delFloor(id) {
  return request({
    url: '/api/floor/' + id,
    method: 'delete'
  })
}

// 导出楼层导航
export function exportFloor(query) {
  return request({
    url: '/api/floor/export',
    method: 'get',
    params: query
  })
}

//楼层导航页详情
export function getBaseHosFloorAndBuildingName(query) {
  return request({
    url: '/api/floor/getBaseHosFloorAndBuildingName',
    method: 'get',
    params: query
  })
}
