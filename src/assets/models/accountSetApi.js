import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl;
export default {
  //获取账号信息接口
  getAccountList(params = {}) {
    return axios.post(prefix + '/user/listAdminUserPageWithAuth', params)
  },
  //新增仓库查询城市接口
  listAdminCity() {
    return axios.get(prefix + `/base/findAllJiupiCityList`)
  },
  //获取角色清单
  findRoleList(params = {}) {
    return axios.post(prefix + `/commonSelectOptionService/queryList`, params)
  },
  //重置密码
  changePasswordByOld(params = {}) {
    return axios.post(prefix + `/templates/adminUser/changePasswordByAdmin`, params)
  },
  //移除角色
  removeAdminAuth(params = ``) {
    return axios.get(prefix + `/user/removeAdminAuth/${params}`)
  },
  //删除司机角色
  removeAdminAuthForDriver(params={authId:``,userId:``}){
    return axios.get(prefix + `/user/removeAdminAuthForDriver/${params.authId}/${params.userId}`)
  },
  //新增用户
  addAdminUser(params = {}) {
    return axios.post(prefix + `/user/addAdminUser`, params)
  },
  //编辑用户
  editAdminUser(params = {}) {
    return axios.post(prefix + `/user/editAdminUser`, params)
  },
  //查询可删除角色权限接口
  queryRefList(params = {}) {
    return axios.post(prefix + `/commonSelectOptionService/queryRefList`, params)
  },
  //新增用户角色
  addAdminAuth(params = {}) {
    return axios.post(prefix + `/user/addAdminAuth`, params)
  },
  //获取仓库列表
  findJiuPiWarehouseListByCityId(params = ``) {
    return axios.get(prefix + `/warehouse/findJiuPiWarehouseListByCityId/${params}`)
  },
  //获取可授权的组织机构列表
  findAllCityList(params=``){
    return axios.get(prefix+`/base/findAllCityList/${params}`)
  },
  //查询一级服务商信息
  findFristOrgClass(){
    return axios.get(prefix+`/base/findFristOrgClass`)
  },
  //新增用户获取城市接口
  findAllCityListWithParent(params=``){
    return axios.get(prefix+`/base/findAllCityListWithParent/${params}`)
  },
  //单个用户信息查询
  queryUserInfo(params=``){
    return axios.get(prefix+`/user/queryUserInfo/${params}`)
  },
  //根据用户信息查询一级服务商信息
  findParentCity(params=``){
    return axios.get(prefix+`/base/findParentCity/${params}`)
  }

}
