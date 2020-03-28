import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
// import VueSocketio from 'vue-socket.io';
// import socketio from 'socket.io-client';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n
import '@/styles/index.scss'; // global css
import '@/styles/base.scss';
import App from './App';
import store from './store';
import router from './router';
import Directive from '@/components/directive';
import DeleteCom from '@/components/deleteCom';
import { message } from '@/utils/tools';
// import * as socketApi from '@/utils/socket';
import splitPane from 'vue-splitpane';
import '@/icons'; // icon
import '@/permission'; // permission control
import fullscreen from 'vue-fullscreen';
import VueClipboard from 'vue-clipboard2';
import Echarts from 'echarts';
window.eventBus = new Vue(); // 注册全局事件对象
// 也可以修改Vue的原型链
Vue.prototype.$event = new Vue();
Vue.prototype.$setlocalstorage = (key, obj) => {
  window.localStorage.setItem(key, JSON.stringify(obj));
};
Vue.prototype.$getlocalstorage = (key, obj) => {
  return JSON.parse(window.localStorage.getItem(key));
};
Vue.prototype.$echarts = Echarts;
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// Vue.prototype.socketApi = socketApi;

Vue.component('split-pane', splitPane);
Vue.use(DeleteCom);
Vue.component('message', message);
Vue.use(ElementUI, { size: 'small' });
// set ElementUI lang to EN
Vue.use({ locale });
Vue.use(Directive);
Vue.use(fullscreen);
Vue.use(VueClipboard);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
