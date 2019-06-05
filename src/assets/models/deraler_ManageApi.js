import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl
export default {

  //用户列表
  dealer_List(params = {}){
    return axios.post(prefix +'/dealer/pagelistdeaer', params)
  },
}
