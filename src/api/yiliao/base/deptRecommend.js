import request from '@/utils/request'

// 查询科室推荐列表
export function listDeptRecommend(query) {
  return request({
    url: '/api/dept/recommend/list',
    method: 'get',
    params: query
  })
}

// 查询固定条数列表
export function listRowDeptRecommend(resultRow) {
  return request({
    url: '/api/dept/recommend/listRow/'+resultRow,
    method: 'get'
  })
}

// 查询热门科室deptCode数组
export function queryDeptCodeList() {
  return request({
    url: '/api/dept/recommend/listDeptCodes/',
    method: 'get',
  })
}

// 查询非热门科室列表
export function listByNotHotDept(query) {
  return request({
    url: '/api/dept/recommend/listByNotHotDept',
    method: 'get',
    params: query

  })
}

// 修改(上传图片 必须使用post请求)
export function updateDeptRecommend(data) {
  return request({
    url: '/api/dept/recommend/update',
    method: 'post',
    data: data
  })
}

// 添加
export function addDeptRecommend(ids){
  return request({
    url: '/api/dept/recommend/add',
    method:'post',
    data: ids
  })
}


// 删除
export function deleteDeptRecommend(id) {
  return request({
    url: '/api/dept/recommend/'+id,
    method: 'delete'
  })
}
