const state = {
  memberDetail: null
};

const getters = {};

const mutations = {
  setMemberDetail(state, memberDetail) {
    state.memberDetail = memberDetail
  },
  cleanMemberDetail(state) {
    state.memberDetail = null
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
