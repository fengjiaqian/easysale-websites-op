import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;
export default {
  //查询仓库信息
  getWarehouseList(params = {}) {
    return axios.post(prefix + '/warehouse/listWarehouseChargeConfigSelective', params);
  },
  //新增仓库
  addNewWarehouse(params = {}) {
    return axios.post(prefix + '/warehouse/addWarehouse', params);
  },
  //新增仓库查询城市接口
  listAdminCity(params = ``) {
    return axios.get(prefix + `/listAdministrativeCity/${params}`)
  },
  //新增仓库查询城市接口
  listCompany(params = ``) {
    return axios.get(prefix + `/org/listSelfAndSubById/${params}`)
  },
  //仓库启用停用方法
  disableWarehouse(params = {}) {
    return axios.get(prefix + `/warehouse/disabled/${params.warehouseId}/${params.status}`)
  },
  //添加仓库
  addWarehouse(params = {}) {
    return axios.post(prefix + `/warehouse/addWarehouse`,params)
  },
  //编辑仓库
  updateWarehouse(params = {}) {
    return axios.post(prefix + `/warehouse/updateWarehouse`,params)
  },
  //仓库查询
  listWarehouseInventory(params={}){
    return axios.post(prefix+`/warehouseQuery/listWarehouseInventory`,params)
  },
  //经销商查询接口
  selectDealerChargeList(params={}){
    return axios.post(prefix+`/ownerManager/selectDealerChargeList`,params)
  },
  //根据条件查询产品列表
  // findProductList(params={}){
  //   return axios.post(prefix+`/productQuery/findProductList`,params)
  // },
  //根据类目品牌产品名称查询产品列表
  productsSearch(params={}){
    return axios.post(prefix+`/setting/productsSearch`,params)
  },
  //查询产品统计类目列表
  findCategorys(params={}){
    return axios.post(prefix+`/productQuery/findCategorys`,params)
  }

}

