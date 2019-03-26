import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl
export default {
  //产品标准费率列表查询接口
  getProductList(params = {}) {
    return axios.post(prefix + '/productManager/selectProductInStockList', params);
  },

}
