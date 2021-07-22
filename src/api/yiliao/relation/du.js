import request from '@/utils/request'

// 查询医患关系_医患关系列表
export function listDu(query) {
  return request({
    url: '/api/relation/du/list',
    method: 'get',
    params: query
  })
}
