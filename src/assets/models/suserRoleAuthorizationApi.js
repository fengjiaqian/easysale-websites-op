import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl
export default {

  //获取角色列表
  getAllRole(params = {}){
    return axios.post(prefix +'/role/roleList', params)
  },

  //给对应的用户 授权选中的角色
  add_authuser_role(params = {}){
    return axios.post(prefix +'/role/saveUserRoleList', params)
  },

  //给对应的用户 修改授权角色
  update_authuser_role(params = {}){
    return axios.post(prefix +'/role/updateUserRoleList', params)
  },

  //获取用户已有的角色ID集
  getUserAuthRoleIds(params = {}){
    return axios.post(prefix +'/role/selectRoleIdList', params)
  },

}
