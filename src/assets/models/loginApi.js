import axios from 'axios';
import Urls from './baseUrl'

const prefixUA=Urls.UA;
const prefix=Urls.supplyChainUrl;
const prefixEA=Urls.EAUrl;
export default {
  //UA登陆，拿到token
  getUALogin(params={}){
    return axios.post(prefixUA+'user/login',params);
  },
  //登陆接口
  getLoginInfo(params={}){
    console.log(params);
    return axios.post(prefixEA+'/login/pcLogin',params);
  },
  //获取菜单权限
  getMenuList(params = ``) {
    return axios.get(prefixEA + `/user/menu/${params}`);
  },
}
