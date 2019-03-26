const state = {
  businessCities: [],//业务城市
  administrativeCities: []//行政城市
};

const getters = {};

const mutations = {

  setAdministrativeCities(state, cities) {
    state.administrativeCities = cities
  },
  //更新多级列表
  updateCitiesOfProvince(state, {indexArr, children}) {
    if (indexArr.length === 1) {
      state.administrativeCities[indexArr[0]].children = children
    }else if(indexArr.length === 2){
      state.administrativeCities[indexArr[0]].children[indexArr[1]].children = children
    }else if(indexArr.length === 3){
      state.administrativeCities[indexArr[0]].children[indexArr[1]].children[indexArr[2]].children = children
    }
  },
  setBusinessCities(state, cities) {
    state.businessCities = cities
  },
};

const actions = {};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
