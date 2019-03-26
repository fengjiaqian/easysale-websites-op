import axios from 'axios'
import qs from 'qs'

let baseUrl = `http://197.168.13.22:9080/`

axios.defaults.withCredentials = true

/**
 * 会员管理
 * @param params
 * @returns {AxiosPromise<any>}
 */

function getMemberList(params) {
  return axios.post(`${baseUrl}templates/listCustomer`, params)
}

function updateMember(params) {
  return axios.post(`${baseUrl}templates/updateCustomer`, params)
}

function addMember(params) {
  return axios.post(`${baseUrl}templates/addCustomer`, params)
}


/**
 * 营业员管理
 * @param params
 * @returns {AxiosPromise<any>}
 */
function getSaleManList(params) {
  return axios.post(`${baseUrl}templates/listSaleMan`, params)
}

function updateSaleMan(params) {
  return axios.post(`${baseUrl}templates/updateSaleMan`, params)
}

function addSaleMan(params) {
  return axios.post(`${baseUrl}templates/addSaleMan`, params)
}

function getSalesmanQRCode(mobileNo) {
  return axios.post(`${baseUrl}templates/getHomeUrl/${mobileNo}`)
}

/**
 * 广告管理
 * @param params
 * @returns {AxiosPromise<any>}
 */
function getAdList(params) {
  return axios.post(`${baseUrl}templates/listBannal`, params)
}

function addAd(params) {
  return axios.post(`${baseUrl}templates/addBannal`, params)
}

function updateAd(params) {
  return axios.post(`${baseUrl}templates/updateBannal`, params)
}

//用户管理

function getUserList(params) {
  return axios.post(`${baseUrl}service/listUser`, params)
}

function addUsers(params) {
  return axios.post(`${baseUrl}service/addUser`, params)
}
function checkState(params){
  return axios.post(`${baseUrl}service/updateStatus`,qs.stringify(params))
}

//

export default {
  baseUrl,
  //会员管理
  getMemberList,
  updateMember,
  addMember,
  //营业员管理
  getSaleManList,
  addSaleMan,
  updateSaleMan,
  getSalesmanQRCode,
  //广告管理
  getAdList,
  addAd,
  updateAd,
  //用户管理
  addUsers,
  getUserList,
  checkState
}
