import request from "@/utils/request";

// 查询咨询订单记录列表
export function listInfo(query) {
    return request({
        url: "/api/consult/info/list",
        method: "get",
        params: query
    });
}

// 查询咨询订单记录详细
export function getInfo(consultId) {
    return request({
        url: "/api/consult/info/" + consultId,
        method: "get"
    });
}

// 新增咨询订单记录
export function addInfo(data) {
    return request({
        url: "/api/consult/info",
        method: "post",
        data: data
    });
}

// 修改咨询订单记录
export function updateInfo(data) {
    return request({
        url: "/api/consult/info",
        method: "put",
        data: data
    });
}

// 删除咨询订单记录
export function delInfo(consultId) {
    return request({
        url: "/api/consult/info/" + consultId,
        method: "delete"
    });
}

// 导出咨询订单记录
export function exportInfo(query) {
    return request({
        url: "/api/consult/info/export",
        method: "get",
        params: query
    });
}
