import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;
export default {
  //入库申请单列表查询
  selectStockInNote(params={}){
    return axios.post(prefix+`/orderManager/selectStockInNote`,params)
  },
  //查询仓库信息
  getWarehouseList(params = {}) {
    return axios.post(prefix + '/warehouse/listWarehouseChargeConfigSelective', params);
  },
  //入库单详情
  selectInStockNoteDetail(params={}){
    return axios.post(prefix+`/orderManager/selectInStockNoteDetail`,params);
  },
  //出库，委托配送申请单列表查询
  selectStockApplyNote(params={}){
    return axios.post(prefix+`/orderManager/selectStockApplyNote`,params);
  },
  //出库，委托配送单申请单详情
  selectApplyStockNoteDetail(params={}){
    return axios.post(prefix+`/orderManager/selectApplyStockNoteDetail`,params);
  },
}
