import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl
export default {
  //获取入驻经销商数据列表
  getEnterSalerList(params = {}) {
    return axios.post(prefix + '/User/GetUserStatis', params);
  },
  //获取入驻经销商详情基本信息数据列表
  getDealerBasicList(params = {}) {
    return axios.post(prefix + '/User/getDetailInfo', params);
  },
}
