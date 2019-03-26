import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;
export default {
  //查询服务商列表
  getServicerList(params = {}) {
    return axios.post(prefix + '/org/listOrg', params);
  },
  //新增服务商
  addServicer(params = {}) {
    return axios.post(prefix + '/org/addOrg', params);
  },
  //修改服务商
  updateServicer(params = {}) {
    return axios.post(prefix + '/org/modifyOrg', params);
  },
  //服务商启用停用方法
  disableServicer(params = {}) {
    return axios.get(prefix + `/org/enableOrg/${params.orgId}/${params.state}`)
  },
  //查询服务商下面的仓库
  getServicerWarehouseList(params = {}) {
    return axios.post(prefix + `/warehouse/listWarehouseChargeConfigSelective`, params)
  },

}

