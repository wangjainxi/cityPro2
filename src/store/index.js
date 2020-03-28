import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import settings from './modules/settings';
import user from './modules/user';
import net from './modules/net';
import common from './modules/common';
import product from './modules/product';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    net,
    common,
    product
  },
  getters
});

export default store;
