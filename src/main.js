import Vue from 'vue'
import ElementUI from 'element-ui';
import store from './assets/data'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import '@/assets/fonts/iconfont.css'
import './utils/registerVue.js'
import axios from 'axios'
import {getCookie} from './utils/CookieUtil'
import Interceptors from './assets/models/defaultInterceptor'
axios.interceptors.request.use(Interceptors.requestInterceptor.config, Interceptors.requestInterceptor.error)
axios.interceptors.response.use(Interceptors.responseInterceptor.response, Interceptors.responseInterceptor.error)

Vue.use(ElementUI);

router.beforeEach(function (to, from, next) {
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
