import axios from 'axios';
import Urls from './baseUrl'

const prefixUA=Urls.UA;
const prefix=Urls.supplyChainUrl;
export default {
  //UA登陆，拿到token
  getUALogin(params={}){
    return axios.post(prefixUA+'user/login',params);
  },
  //登陆接口
  getLoginInfo(params={}){
    return axios.post(prefix+'/user/loginInfo',params);
  },
  //获取餐单权限
  getMenuList(params = ``) {
    return axios.get(prefix + `/user/menu/${params}`);
  },
}
