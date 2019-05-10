import axios from 'axios';
import Urls from './baseUrl'
const prefix = Urls.supplyChainUrl
export default {

  //店铺列表
  shopList(params = {}){
    return axios.post(prefix +'/shop/lisShopByParams', params)
  },

  //店铺新增
  shopadd(params = {}){
    return axios.post(prefix +'/shop/addShop', params)
  },

  //店铺修改
  shopupdtae(params = {}){
    return axios.post(prefix +'/shop/updateShop', params)
  },

}
