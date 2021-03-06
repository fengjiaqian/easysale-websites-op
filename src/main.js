import Vue from 'vue'
import ElementUI from 'element-ui';
import store from './assets/data'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import '@/assets/fonts/iconfont.css'
import './utils/registerVue.js'

import Print from './utils/print.js'

import axios from 'axios'
import {getCookie} from './utils/CookieUtil'
import '@/assets/jigsaw/jigsaw.css'
import '@/assets/jigsaw/jigsaw.js'

import Interceptors from './assets/models/defaultInterceptor'
axios.interceptors.request.use(Interceptors.requestInterceptor.config, Interceptors.requestInterceptor.error)
axios.interceptors.response.use(Interceptors.responseInterceptor.response, Interceptors.responseInterceptor.error)

Vue.use(ElementUI);
Vue.use(Print)
router.beforeEach(function (to, from, next) {

  if(to.path === "/orderlist" ){
     next();
     return;
  }
  if(to.path === "/orderprinting" ){
    next();
    return;
  }

  let hasToken = !!this.app.$options.store.state.user.token;
  if (to.path === "/login" || to.path === "/resetPassword") {
    next();
  } else if (!hasToken) {
    next({path: '/login', replace: true, query: {redirect: to.fullPath}});
  }else{
    next();
  }
}.bind(router));

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
