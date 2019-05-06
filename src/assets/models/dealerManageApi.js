import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl
export default {
  //获取入驻经销商数据列表
  getDealerList(params = {}) {
    return axios.post(prefix + '/ownerManager/selectAgencyChargeList', params);
  },
  //启用停用经销商费用配置
  updateState(params = {}) {
    return axios.post(prefix + '/ownerManager/updateAgencyConfigStatus', params);
  },
  //设置对某个经销商是否收费
  updateFee(params = {}) {
    return axios.post(prefix + '/ownerManager/saveOrUpdateAgencyChargeConfig', params);
  },

  //获取经销商详情下的仓配服务信息
  // get(params = {}) {
  //   return axios.post(prefix + '/ownerManager/saveOrUpdateAgencyChargeConfig', params);
  // },

//获取经销商审核列表
  getDealerAuditList(params = {}) {
    return axios.post(prefix + '/dealerManage/selectAllDealerList', params);
  },

//  经销商审核
  auditDealerState(params = {}) {
    return axios.post(prefix + '/dealerManage/auditDealerState', params);
  },
  /*经销商审核详情*/
  dealerAuditDetail(params = {}) {
    return axios.post(prefix + '/dealerManage/selectDealerDetail', params)
  },
  //店铺审核
  auditShopState(params = {}) {
    return axios.post(prefix + '/dealerManage/auditShopState', params)
  }

}
