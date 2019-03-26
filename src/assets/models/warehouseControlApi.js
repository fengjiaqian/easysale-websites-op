import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;
export default {
  getWarehouseConfigList(params){
    return axios.post(prefix + '/warehouseControl/getWareHouseConfigList', params)
  },
  addWarehouseConfig(params){
    return axios.post(prefix + '/warehouseControl/addWareHouseConfig', params)
  },
  updateWarehouseConfig(params){
    return axios.post(prefix + '/warehouseControl/updateWareHouseConfig', params)
  },
  getWarehouseConfigInfo(params){
    return axios.post(prefix+'/warehouseControl/getWareHouseConfigInfo',params)
  },
  //删除策略
  deleteWarehouseConfig(params){
    return axios.post(prefix+'/warehouseControl/deleteWarehouseConfig',params)
  },
  //修改策略信息
  updateWareHouseConfig(params){
    return axios.post(prefix+`/warehouseControl/updateWareHouseConfig`,params)
  }
}
