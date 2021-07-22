import request from '@/utils/request'

export function listDocInfo(query) {
    return request({
        url: '/api/patientreg/list',
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

// 单条详情
export function getDocInfo(id) {
    return request({
        url: '/api/patientreg/' + id,
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

// 修改密码
export function updateDocInfoPassword(data) {
    return request({
        url: '/api/patientreg/upd',
        method: 'put',
        data: data
    })
}

// 修改患者信息
export function updateDocInfo(data) {
    return request({
        url: '/api/patientreg',
        method: 'put',
        data: data
    })
}

// 删除患者信息
export function delDocInfo(id) {
    return request({
        url: '/api/book/docInfo/' + id,
        method: 'delete'
    })
}

// 导出患者信息
export function exportDocInfo(query) {
    return request({
        url: '/api/book/docInfo/export',
        method: 'get',
        params: query
    })
}

export function getDiagnosis(id) {
    return request({
        url: '/api/patientreg/diagnosis/'+id,
        method: 'get'
    })
}

// 查看详情
export function getDiagnosisById(id){
    return request({
        url: 'api/patientreg/diagnosisById/'+id,
        method: 'get'
    })
}

export function updateDiagnosis(data){
    return request({
        url: '/api/patientreg/diagnosis',
        method: 'put',
        data: data
    })
}
