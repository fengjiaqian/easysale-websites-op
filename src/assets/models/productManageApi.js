import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;

export default {
  //申请入库产品待设置和已设置
  getProductInStockList(params = {}) {
    return axios.post(prefix + '/productManager/selectProductInStockList', params)
  },

  //产品详情
  getProductDetailInfo(params = {}) {
    return axios.post(prefix + '/productManager/selectDealerProductDetail', params)
  },

  //查询产品
  getProductList(params = {}) {
    return axios.post(prefix + '/productManager/findProductProList', params)
  },

  //新增或修改产品
  addOrEditProduct(params = {}) {
    return axios.post(prefix + '/productManager/saveOrUpdateChargeConfig', params)
  },

  //启用停用
  updateProductStatus(params = {}) {
    return axios.post(prefix + '/productManager/updateProductConfigStatus', params)
  },

  //模糊查询经销商名称
  queryDealer(params = {}){
    return axios.post(prefix + '/ownerManager/selectDealerList', params)
  },
}
