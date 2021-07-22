import request from '@/utils/request'

// 查询菜单列表
export function listPermission(query) {
  return request({
    url: '/system/permission/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getPermission(id) {
  return request({
    url: '/system/permission/' + id,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/permission/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function rolePermissionTreeselect(roleId) {
  return request({
    url: '/system/permission/rolePermissionTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addPermission(data) {
  return request({
    url: '/system/permission',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updatePermission(data) {
  return request({
    url: '/system/permission',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delPermission(id) {
  return request({
    url: '/system/permission/' + id,
    method: 'delete'
  })
}