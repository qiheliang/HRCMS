export default {
  // domain: 'http://10.10.3.88:8916/',
  login: 'manageapi/hr/login',
  domain: 'http://192.168.101.221:8916/',
  // domain: 'http://192.168.101.220:8050/',
  // login: 'manageapi/accountapi/Login',
  getUserTableData: 'manageapi/usermanagementapi/getlist', // 获取后台权限用户管理列表
  getRoleTableData: 'manageapi/rolemanagementapi/getlist', // 获取后台权限角色管理列表
  delUser: 'manageapi/usermanagementapi/delete', // 删除管理用户
  delRole: 'manageapi/rolemanagementapi/delete', // 删除管理角色
  addUser: 'manageapi/usermanagementapi/add', // 添加管理用户
  addRole: 'manageapi/rolemanagementapi/add', // 添加管理角色
  updateUser: 'manageapi/usermanagementapi/update', // 修改管理用户
  updateRole: 'manageapi/rolemanagementapi/update', // 修改管理角色
  getNav: 'manageapi/homeapi/index', // 获取导航
  getRole: 'manageapi/usermanagementapi/getrolelist', // 获取角色列表
  getNavTree: 'manageapi/rolemanagementapi/getrightsdef', // 获取导航树
  getRolePermission: 'manageapi/rolemanagementapi/GetRoleRights', // 获取个人权限
  getNavTreeManage: 'manageapi/confignavmenuapi/getlist', // 获取导航树
  updateNav: 'manageapi/confignavmenuapi/update', // 改变导航树
};
