import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;
export default {
  //获取子公司列表
  getCompanyList(params = {}) {
    return axios.post(prefix + '/subOrg/pageList', params);
  },
  //子公司查询城市
  getCompanyCity(params={}){
    return axios.post(prefix+'/subOrg/findCity',params);
  },
  //新增子公司
  addNewCompany(params={}){
    return axios.post(prefix+'/subOrg/addOne',params);
  },
  //编辑子公司
  editSubCompany(params={}){
    return axios.post(prefix+'/subOrg/updateOne',params);
  },
  //查找一个子公司
  findOneCompany(params={}){
    return axios.post(prefix+'/subOrg/findOne',params);
  },

}
