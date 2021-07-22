import request from '@/utils/request'

export function listRecipeInfo(query) {
  return request({
    url: '/api/recipe/recipeInfo/list',
    method: 'get',
    params: query
  })
}

// export function listDocInfo(query) {
//   return request({
//     url: '/api/book/docInfo/findbyjoinone',
//     method: 'get',
//     params: query
//   })
// }

// url: '/api/book/docInfo/findbyjoinone',

// 查询医生信息
export function getRecipeInfo(id) {
  return request({
    url: '/api/recipe/recipeInfo/' + id,
    method: 'get'
  })
}

// 新增医生信息
export function addRecipeInfo(data) {
  return request({
    url: '/api/recipe/recipeInfo',
    method: 'post',
    data: data
  })
}

// 修改医生信息
export function updateRecipeInfo(data) {
  return request({
    url: '/api/recipe/recipeInfo',
    method: 'put',
    data: data
  })
}

// 删除系统_广告_设置
export function delRecipeInfo(id) {
  return request({
    url: '/api/recipe/recipeInfo/' + id,
    method: 'delete'
  })
}

// 导出系统_广告_设置
export function exportRecipeInfo(query) {
  return request({
    url: '/api/recipe/recipeInfo/export',
    method: 'get',
    params: query
  })
}

// 修改医生密码
export function updatePwd(docId,newPwd) {
  return request({
    url: '/api/recipe/recipeInfo/updatePwd',
    method: 'put',
    data: {
      "docId":docId,
      "newPwd":newPwd
    }
  })
}



