import request from '@/utils/request'

// 查询平台药品列表
export function listDrug(query) {
  return request({
    url: '/system/drug/list',
    method: 'get',
    params: query
  })
}

// 查询平台药品详细
export function getDrug(id) {
  return request({
    url: '/system/drug/' + id,
    method: 'get'
  })
}

// 新增平台药品
export function addDrug(data) {
  return request({
    url: '/system/drug',
    method: 'post',
    data: data
  })
}


// 修改平台药品
export function updateDrug(data) {
  return request({
    url: '/system/drug',
    method: 'put',
    data: data
  })
}

// 删除平台药品
export function delDrug(id) {
  return request({
    url: '/system/drug/' + id,
    method: 'delete'
  })
}

// 导出平台药品
export function exportDrug(query) {
  return request({
    url: '/system/drug/export',
    method: 'get'
  })
}

//获取药品互斥列表
export function getDrugExclusionList(query){
  return request({
    url: '/system/drug/selectRecipeDrugExclusionListByDrugId',
    method: 'get',
    params: query
  })
}

//批量修改状态
export function updateRecipeDrugExclude(drugId,excludeDrugIds) {
  return request({
    url: '/system/drug/updateRecipeDrugExclude',
    method: 'put',
    data: {
      "drugId":drugId,
      "excludeDrugIds":excludeDrugIds
    },
  })
}

//批量修改状态
export function deleteRecipeDrugExclude(drugId,excludeDrugIds) {
  return request({
    url: '/system/drug/deleteRecipeDrugExclude',
    method: 'put',
    data: {
      "drugId":drugId,
      "excludeDrugIds":excludeDrugIds
    },
  })
}

// 下载药品导入模板
export function importTemplate() {
    return request({
        url: '/system/drug/importTemplate',
        method: 'get'
    })
}
