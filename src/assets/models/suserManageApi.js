import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl
export default {

  //新增用户
  addSuserObj(params = {}){
    return axios.post(prefix +'/user/addUser', params)
  },

  //用户列表
  suser_List(params = {}){
    return axios.post(prefix +'/user/getUserListByParams', params)
  },

  //用户修改
  updateSuserObj(params = {}){
    return axios.post(prefix +'/user/updateUser', params)
  },

  //查询用户实体
  getSuserObj(params = {}){
    return axios.post(prefix +'/user/findUserInfo', params)
  }

}
