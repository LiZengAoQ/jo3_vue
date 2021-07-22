import request from '@/utils/request'

// 查询列表
export function listInventoryRecord(query) {
  return request({
    url: '/api/recipe/inventory/record/list',
    method: 'get',
    params: query
  })
}

//查询医院列表
export function getHosNameList() {
  return request({
    url: '/api/recipe/inventory/record/listByOption/'+ 'hosName',
    method: 'get',
  })
}

//查询创建人列表
export function getCreateNameList() {
  return request({
    url: '/api/recipe/inventory/record/listByOption/'+ 'createName',
    method: 'get'
  })
}










// 查询疾病诊断详细
export function getDiagnosis(id) {
  return request({
    url: '/api/diagnosis/' + id,
    method: 'get'
  })
}


// 修改疾病诊断
export function updateDiagnosis(data) {
  return request({
    url: '/api/diagnosis',
    method: 'put',
    data: data
  })
}


// 导出疾病诊断
export function exportChangeRecord(query) {
  return request({
    url: '/api/diagnosis/export',
    method: 'get',
    params: query
  })
}
