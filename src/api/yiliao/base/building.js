import request from '@/utils/request'

// 查询医院大楼列表
export function listBuilding(query) {
  return request({
    url: '/api/building/list',
    method: 'get',
    params: query
  })
}

// 查询医院大楼详细
export function getBuilding(id) {
  return request({
    url: '/api/building/' + id,
    method: 'get'
  })
}

// 新增医院大楼
export function addBuilding(data) {
  return request({
    url: '/api/building',
    method: 'post',
    data: data
  })
}

// 修改医院大楼
export function updateBuilding(data) {
  return request({
    url: '/api/building',
    method: 'put',
    data: data
  })
}

// 删除医院大楼
export function delBuilding(id) {
  return request({
    url: '/api/building/' + id,
    method: 'delete'
  })
}

// 导出医院大楼
export function exportBuilding(query) {
  return request({
    url: '/api/building/export',
    method: 'get',
    params: query
  })
}

// 楼层导航按钮中的列表
export function listFloorByBuildingId(query) {
  return request({
    url: '/api/floor/selectHosFloorListByBuildingId',
    method: 'get',
    params: query
  })
}

// 楼栋多选按钮 启用
export function updateBaseHosBuildingActivesByStart(ids) {
  return request({
    url: '/api/building/updateBaseHosBuildingActivesByStart/' + ids,
    method: 'delete'
  })
}


// 楼栋多选按钮 停用
export function updateBaseHosBuildingActivesByStop(ids) {
  return request({
    url: '/api/building/updateBaseHosBuildingActivesByStop/' + ids,
    method: 'delete'
  })
}

// 楼层多选按钮 启用
export function updateBaseHosFloorActivesByStart(ids) {
  return request({
    url: '/api/floor/updateBaseHosFloorActivesByStart/' + ids,
    method: 'delete'
  })
}


// 楼层多选按钮 停用
export function updateBaseHosFloorActivesByStop(ids) {
  return request({
    url: '/api/floor/updateBaseHosFloorActivesByStop/' + ids,
    method: 'delete'
  })
}
