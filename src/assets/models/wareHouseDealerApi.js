import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;

export default {
  //经销商仓配首页
  getDealerHomeList(params = {}) {
    return axios.post(prefix + '/ownerManager/selectDealerChargeList', params)
  },

  //是否收费
  editChargeType(params = {}) {
    return axios.post(prefix + '/ownerManager/saveOrUpdateDealerChargeConfig', params)
  },

  //启用停用经销商费用配置
  updateDealerStatus(params = {}) {
    return axios.post(prefix + '/ownerManager/updateDealerConfigStatus', params)
  },

  //根据经销商id,城市id过滤仓库
  filterDealerWarehouseList(params = {}) {
    return axios.post(prefix + '/ownerManager/selectDealerWarehouseList', params)
  },

  //查询经销商服务数据相关费用
  queryAmountList(params = {}) {
    return axios.post(prefix + '/ownerManager/stockChargeAmountList', params)
  },

  //服务数据统计
  AmountAllList(params = {}) {
    return axios.post(prefix + '/ownerManager/findTotalChargeStats', params)
  },

  //经销商托管商品
  queryProductList(params = {}) {
    return axios.post(prefix + '/ownerManager/selectDealerProductList', params)
  },

  //修改产品费用
  editProductCharge(params = {}){
    return axios.post(prefix + '/productManager/saveOrUpdateChargeConfig', params)
  },

  //首页申请入库产品待办数量
  getApplyProductAmount(params={}){
    return axios.post(prefix + '/allot/findStockInRecordCount', params)
  }

}
