import request from '@/utils/request'

// tongji
export function listYhgx(query) {
  return request({
    url: '/api/tongji/getcount',
    method: 'get',
    params: query
  })
}

// plus版本
export function listYhgxPlus(query) {
    return request({
        url: '/api/tongji/getcountPlus',
        method: 'get',
        params: query
    })
}
