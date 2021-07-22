import request from "@/utils/request";

// 查询会话消息列表
export function listMessage(query) {
  return request({
    url: "/api/message/list",
    method: "get",
    params: query
  });
}

// 查询会话消息详细
export function getMessage(id) {
  return request({
    url: "/api/message/" + id,
    method: "get"
  });
}

// 新增会话消息
export function addMessage(data) {
  return request({
    url: "/api/message",
    method: "post",
    data: data
  });
}

// 修改会话消息
export function updateMessage(data) {
  return request({
    url: "/api/message",
    method: "put",
    data: data
  });
}

// 删除会话消息
export function delMessage(id) {
  return request({
    url: "/api/message/" + id,
    method: "delete"
  });
}

// 导出会话消息
export function exportMessage(query) {
  return request({
    url: "/api/message/export",
    method: "get",
    params: query
  });
}
