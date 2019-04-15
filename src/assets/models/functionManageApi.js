import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl
export default {

  //新增功能
  addFucntionObj(params = {}){
    return axios.post(prefix +'/permission/insertPermission', params)
  },

  //功能列表
  functionList(params = {}){
    return axios.post(prefix +'/permission/getPermissionsByParam', params)
  },

  //修改功能
  updateFuctionObj(params = {}){
    return axios.post(prefix +'/permission/updatePermission', params)
  },

  //查询功能实体
  getFunctionObj(params = {}){
    return axios.post(prefix +'/permission/getPermissionsByParam', params)
  }

}
