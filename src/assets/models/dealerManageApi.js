import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl
export default {
  //获取入驻经销商数据列表
  findDealerList(params = {}) {
    return axios.post(prefix + '/dealer/findDealerListByParam', params);
  },
}
