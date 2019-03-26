import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cities from './modules/cities'
import appConfig from './modules/appConfig'
import addStrategy from './modules/addStrategy'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    cities,
    appConfig,
    addStrategy
  }
})

export default store
