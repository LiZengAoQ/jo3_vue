import request from '@/utils/request'

export function listDocInfo(query) {
    return request({
        url: '/api/book/docInfo/list',
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
export function getDocInfo(id) {
    return request({
        url: '/api/book/docInfo/' + id,
        method: 'get'
    })
}

// 新增医生信息
export function addDocInfo(data) {
    return request({
        url: '/api/book/docInfo',
        method: 'post',
        data: data
    })
}

// 修改医生信息
export function updateDocInfo(data) {
    return request({
        url: '/api/book/docInfo',
        method: 'put',
        data: data
    })
}

export function bingding(data) {
    return request({
        url: '/api/book/docInfo/bingding',
        method: 'put',
        data: data
    })
}

// 修改医生信息
export function updateDocInfoRole(data) {
    return request({
        url: '/api/book/docInfo/editRole',
        method: 'put',
        data: data
    })
}

//修改密码
export function updatePassword(id) {
    return request({
        url: 'api/book/docInfo/upd' + id,
        method: 'get'
    })
}

//查询公告
export function lookGongInfo(data) {
    return request({
        url: '/api/book/docInfo/noticelist?id=' + data.id + '&noticeType=' + data.noticeType,
        method: 'get'
        // data: data
    })
}

//查询绑定挂号医生
export function bangdingInfo(data) {
    return request({
        url: '/api/book/docInfo/BindingInfo/',
        method: 'get',
        params: data
    })
}

//查询绑定网络门诊医生
export function menzhenInfo(data) {
    return request({
        url: '/api/book/docInfo/NetworkInfo',
        method: 'get'
        // data: data
    })
}

// 删除系统_广告_设置
export function delDocInfo(id) {
    return request({
        url: '/api/book/docInfo/' + id,
        method: 'delete'
    })
}

// 导出系统_广告_设置
export function exportDocInfo(query) {
    return request({
        url: '/api/book/docInfo/export',
        method: 'get',
        params: query
    })
}
