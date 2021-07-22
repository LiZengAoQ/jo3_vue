import request from '@/utils/request'

// 查询菜单列表
export function listGzzPermission(query) {
  return request({
    url: '/api/gzz/permission/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getGzzPermission(id) {
  return request({
    url: '/api/gzz/permission/' + id,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/api/gzz/permission/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function rolePermissionTreeselect(roleId) {
  return request({
    url: '/api/gzz/permission/rolePermissionTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addGzzPermission(data) {
  return request({
    url: 'api/gzz/permission',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateGzzPermission(data) {
  return request({
    url: 'api/gzz/permission',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delGzzPermission(id) {
  return request({
    url: 'api/gzz/permission/' + id,
    method: 'delete'
  })
}
