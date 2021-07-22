import request from '@/utils/request'

// 查询版本管理列表
export function listVersion(query) {
    return request({
        url: '/api/sysAppVersion/find',
        method: 'get',
        params: query
    })
}

// 查询版本管理详细
export function getVersion(query) {
    return request({
        url: '/api/sysAppVersion/findbyid',
        method: 'get',
        params: query
    })
}

// 新增版本管理
export function addVersion(data) {
    return request({
        url: '/api/sysAppVersion/insert',
        method: 'get',
        params: data
    })
}

// 修改版本管理
export function updateVersion(data) {
    return request({
        url: '/api/sysAppVersion/update',
        method: 'put',
        params: data
    })
}
