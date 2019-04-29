import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.EAUrl;
export default {
  //客户列表查询
  findCustomerListByParam(params={}){
    return axios.post(prefix+`/customer/findCustomerListByParam`,params)
  },
  //修改客户信息
  updateCustomer(params={}){
    return axios.post(prefix+`/customer/updateCustomer`,params)
  },
  //查询客户信息
  findCustomerInfo(params={}){
    return axios.post(prefix+`/customer/findCustomerInfo`,params)
  }
}
