import request from '@/utils/request'

// 查询医患关系_群发记录列表
export function listMass(query) {
  return request({
    url: '/api/relation/mass/list',
    method: 'get',
    params: query
  })
}
