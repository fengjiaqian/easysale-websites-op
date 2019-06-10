import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl
export default {

  //新增用户
  addSuserObj(params = {}){
    return axios.post(prefix +'/user/addUser', params)
  },

  //新增用户经销商
  addUserAndDer(params = {}){
    return axios.post(prefix +'/user/adddealer', params)
  },

  //用户列表
  suser_List(params = {}){
    return axios.post(prefix +'/user/getOpUserList', params)
  },

  //用户修改
  updateSuserObj(params = {}){
    return axios.post(prefix +'/user/updateUser', params)
  },

  //查询用户实体
  getSuserObj(params = {}){
    return axios.post(prefix +'/user/findUserInfo', params)
  },
  //审核userApplyDer
  userApplyDer(params = {}){
    return axios.post(prefix +'/user/auditCustomerApplyToDealer', params)
  },

  //查询当前用户申请的信息user/findApplyDealer
  findApplyDealer(params = {}){
    return axios.post(prefix +'/user/findApplyDealer', params)
  },

  //申请成店老板的待审核列表
  dealerbossapplylist(params = {}){
    return axios.post(prefix +'/user/dealerbossapplylist', params)
  },

  //申请详情
  dealerbossapplyinfo(params = {}){
    return axios.post(prefix +'/user/dealerbossapplyinfo', params)
  },

  // 审核
  dealerbossapply(params = {}){
    return axios.post(prefix +'/user/dealerbossapply', params)
  },

  refusebossapply(params = {}){
    return axios.post(prefix +'/user/refusebossapply', params)
  },

}
