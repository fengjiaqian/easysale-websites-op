import axios from 'axios';
import Urls from './baseUrl'
const prefix = Urls.supplyChainUrl
export default {

  //内容配置列表
  contentList(params = {}){
    console.log(params);
    return axios.post(prefix +'/contentConfig/findContentList', params)
  },

  //内容配置新增
  saveOrUpdate(params = {}){
    console.log(params);
    return axios.post(prefix +'/contentConfig/saveOrUpdate', params)
  },

  //内容配置修改
  deleteContentConfiguration(params = {}){
    console.log(params);
    return axios.post(prefix +'/contentConfig/deleteById', params)
  },

  //店铺修改
  shopupdtae(params = {}){
    return axios.post(prefix +'/shop/updateShop', params)
  },

}
