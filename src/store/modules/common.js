const state = {
  clientParams: {
    width: 0,
    height: 0
  }
};

const mutations = {
  SET_CLIENT_PARAMS: (state, data) => {
    state.clientParams.width = data.w;
    state.clientParams.height = data.h;
  }
};

const actions = {
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
