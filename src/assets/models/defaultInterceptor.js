import store from '@/assets/data/index'

let config = {notShowLoading: false}
/**
 * 不需要loading效果，则需要在axios请求中配置,如下:
 *
 * const config={notShowLoading:true}
 *
 * axios.post(prefix + '/Product/ListCategoryAndBrand', params, config);
 *
 **/
let needLoadingRequestCount = 0;

function startLoading() {
  //vuex设置全局loading的变量showLoading为true，显示loading效果
  store.state.showLoading.showLoading = true;
}

function endLoading() {
  //vuex设置全局loading的变量showLoading为false，关闭loading效果
  store.state.showLoading.showLoading = false;
}

let showFullScreenLoading = function () {
  if (needLoadingRequestCount === 0) {

    startLoading();
  }
  needLoadingRequestCount++
}

let tryHideFullScreenLoading = function () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

const requestInterceptor = {
  config: (config) => {
    // if (!config.notShowLoading) {
    //   showFullScreenLoading();
    // }
    //添加token
    if (store.state.user && store.state.user.token) {
      config.headers.token = store.state.user.token
    }
    // if (store.state.user && store.state.user.userInfo && store.state.user.userInfo.token) {
    //   config.headers.token = store.state.user.userInfo.token
    // }
    // //添加cityId
    // if (store.state.currentCity && store.state.currentCity.currentCity && store.state.currentCity.currentCity.id) {
    //   config.headers.cityId = store.state.currentCity.currentCity.id
    // }
    // //添加经销商Id和操作人Id
    // if (store.state.dealerInfo&&store.state.dealerInfo.shopId) {
    //   config.data.shopId = store.state.dealerInfo.shopId
    //   config.data.createrUserId = store.state.dealerInfo.userId
    // }
    return config;
  },
  error: (error) => {
    console.log('请求出错')
    // tryHideFullScreenLoading();
    // this.hideLoading();
    return Promise.reject(error);
  },
}
const responseInterceptor = {
  response: (response) => {
    // tryHideFullScreenLoading();
    let serverData = response.data
    if (response.status < 200 || response.status >= 300)
      return Promise.reject(`网络错误`)
    //UA供应链公用，但是返回的参数不一样
    let isSup = serverData.result
    if (isSup) {
      if (serverData.result !== `success`) {
        return Promise.reject(serverData.message)
      } else {
        //如果返回的数据里带了totalCount则将其放入data字段下
        if (null !== serverData.totalCount && undefined !== serverData.totalCount && serverData.data) {
          serverData.data.totalCount = serverData.totalCount
        }
        return serverData.data;
      }
    } else {
      if (!serverData.success) {
        return Promise.reject(serverData.message)
      } else {
        return serverData.data;
      }
    }

  },
  error: (error) => {
    console.log('响应出错')
    console.log('error', error)
    // tryHideFullScreenLoading();
    if (typeof error === `string`) {
      return Promise.reject(error);
    } else {
      return Promise.reject(`服务暂不可用，请稍后重试`);
    }
  },
}

export default {requestInterceptor, responseInterceptor, showFullScreenLoading, tryHideFullScreenLoading}
