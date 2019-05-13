import axios from 'axios';
import Urls from './baseUrl'
const prefix = Urls.supplyChainUrl
export default {

  //日志列表
  loglist(params = {}){
    return axios.post(prefix +'/log/pagelist', params)
  },

}
