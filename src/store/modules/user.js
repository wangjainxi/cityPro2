import { login, getInfo } from '@/api/user';
import { directLogin } from '@/utils/tools';

const state = {
  token: '',
  deTokenObj: {},
  refreshToken: '',
  deRefreshTokenObj: {},
  name: '',
  avatar: ''
};

const mutations = {
  SET_TOKEN: (state, res) => {
    state.token = res.token;
    state.refreshToken = res.refreshToken;
    window.localStorage.clear();
    window.localStorage.setItem('token', res.token);
    window.localStorage.setItem('refreshToken', res.refreshToken);
  },
  REMOVE_TOKEN: (state) => {
    state.token = '';
    state.refreshToken = '';
    window.localStorage.clear();
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {

    state.avatar = avatar;

  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {

    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {

      login({ username: username.trim(), password: password }).then(response => {

        console.log('token2', response);
        commit('SET_TOKEN', response);
        resolve();

      }).catch(error => {
        console.log('login-err',);
        reject(error);

      });

    });

  },

  // get user info
  getInfo({ commit, state }) {

    return new Promise((resolve, reject) => {

      getInfo(state.token).then(response => {

        const { data } = response;

        if (!data) {

          reject('Verification failed, please Login again.');

        }

        const { name, avatar } = data;

        commit('SET_NAME', name);
        commit('SET_AVATAR', avatar);
        resolve(data);

      }).catch(error => {

        reject(error);

      });

    });

  },

  // user logout
  logout({ commit, state }) {

    return new Promise((resolve, reject) => {

      commit('REMOVE_TOKEN');
      directLogin();
      resolve();
      // logout(state.token).then(() => {

      //   commit('REMOVE_TOKEN');
      //   resetRouter();
      //   resolve();

      // }).catch(error => {

      //   reject(error);

      // });

    });

  },

  // remove token
  resetToken({ commit }) {

    return new Promise(resolve => {

      commit('REMOVE_TOKEN');
      resolve();

    });

  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

