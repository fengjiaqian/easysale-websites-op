import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.EAUrl;
export default {
  //获取角色信息
  getRoleList(params = {}) {
    return axios.post(prefix + '/role/roleList', params)
  },
  //新增角色
  addRole(params = {}) {
    return axios.post(prefix + '/role/saveBackRole', params)
  },
  //启用停用
  updateUserRoleState(params = {}) {
    return axios.post(prefix + '/role/updateUserRoleState', params)
  },
  //编辑角色
  updateBackRole(params = {}) {
    return axios.post(prefix + '/role/updateBackRole', params)
  },
 //查询角色信息
  selectRoleById(params={}){
    console.log(params);
    return axios.post(prefix + '/role/selectRoleById', params)
  },
  //查寻所有功能信息
  findAllPermissionList(params={}){
    console.log(params);
    return axios.post(prefix + '/permission/getPermissionTreeByIds', params)
  },
  //查寻该角色的所有权限
  findAllRolePermission(params={}){
    return axios.post(prefix + '/role/selectPermissionIdList', params);
  },






  //获取角色清单
  findRoleList(params = {}) {
    return axios.post(prefix + `/commonSelectOptionService/queryList`, params)
  },
  //重置密码
  changePasswordByOld(params = {}) {
    return axios.post(prefix + `/templates/adminUser/changePasswordByAdmin`, params)
  },
  //移除角色
  removeAdminAuth(params = ``) {
    return axios.get(prefix + `/user/removeAdminAuth/${params}`)
  },
  //删除司机角色
  removeAdminAuthForDriver(params={authId:``,userId:``}){
    return axios.get(prefix + `/user/removeAdminAuthForDriver/${params.authId}/${params.userId}`)
  },
  //新增用户
  addAdminUser(params = {}) {
    return axios.post(prefix + `/user/addAdminUser`, params)
  },
  //编辑用户
  editAdminUser(params = {}) {
    return axios.post(prefix + `/user/editAdminUser`, params)
  },
  //新增用户角色
  addAdminAuth(params = {}) {
    return axios.post(prefix + `/user/addAdminAuth`, params)
  },
  //获取仓库列表
  findJiuPiWarehouseListByCityId(params = ``) {
    return axios.get(prefix + `/warehouse/findJiuPiWarehouseListByCityId/${params}`)
  },


}
