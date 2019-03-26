const state = {
  checkState: sessionStorage.getItem(`checkState`)||false,
  token:sessionStorage.getItem(`token`)||``,
  userInfo:JSON.parse(sessionStorage.getItem(`userInfo`))||{},
  choosenRole:sessionStorage.getItem(`choosenRole`)||``,
  roleInfoList:JSON.parse(sessionStorage.getItem(`roleInfoList`))||[],
  originRole:sessionStorage.getItem(`originRole`)||``,
  choseRoleInfoList:JSON.parse(sessionStorage.getItem(`choseRoleInfoList`))||[]
};

const getters = {
  getUserInfo(state){
    return state.userInfo
  },

};

const mutations = {
  updateCheckState(state,value) {
   sessionStorage.setItem(`checkState`,value)
    state.checkState = value
  },
  //保存用户登录信息
  setUserInfo(state, userInfo) {
    sessionStorage.setItem(`userInfo`, JSON.stringify(userInfo))
    state.userInfo = userInfo;
  },
  //保存token
  setToken(state,token){
    sessionStorage.setItem(`token`,token)
    state.token=token;
  },
  updateChoosenRole(state,choosenRole){
    sessionStorage.setItem(`choosenRole`,choosenRole)
    state.choosenRole=choosenRole;
  },
  //保存菜单
  setRoleInfoList(state,roleInfoList){
    sessionStorage.setItem(`roleInfoList`, JSON.stringify(roleInfoList))
    state.roleInfoList=roleInfoList
  },
  //保存更改前的角色
  setOriginRole(state,originRole){
    sessionStorage.setItem(`originRole`,originRole)
    state.originRole=originRole
  },
  //保存当前选中角色的信息
  setChoseRoleInfoList(state,choseRoleInfoList){
    sessionStorage.setItem(`choseRoleInfoList`, JSON.stringify(choseRoleInfoList));
    state.choseRoleInfoList=choseRoleInfoList;
  },
  clearToken(state){
    sessionStorage.setItem(`token`,``);
    state.token=``;
  }
};

const actions = {
  updateState(context,value){
    context.commit('updateCheckState',value)
  },

  updateToken(context,value){
    context.commit('setToken',value)
  },
  updateUserInfo(context,value){
    context.commit('setUserInfo',value)
  },
  updateChoseRole(context,value){
    context.commit('updateChoosenRole',value)
  },
  updateRoleInfoList(context,value){
    context.commit('setRoleInfoList',value)
  },
  updateOriginRole(context,value){
    context.commit('setOriginRole',value)
  },
  updateChoseRoleInfoList(context,value){
    context.commit('setChoseRoleInfoList',value)
  }

};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
