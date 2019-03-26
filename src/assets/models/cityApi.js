import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;
export default {

  //行政城市查询
  listAdminCity(params = ``) {
    return axios.get(prefix + `/listAdministrativeCity/${params}`)
  },

  //业务城市查询
  listBizCity() {
    return axios.get(prefix + `/base/findAllJiupiCityList`)
  },

}
