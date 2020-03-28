import axios from 'axios';
import store from '@/store';
import { Loading } from 'element-ui';
import { isTokenExpired, isRefreshTokenExpired, directLogin, post, message } from '@/utils/tools';

let loading;

// 是否有请求在刷新token
window.isRefreshing = false;

// 结束加载
export const endLoading = () => {
  loading.close();
};

// 被挂起的请求数组
const subscribesArr = [];

// push所有请求到数组中
const subscribeTokenRefresh = (cb) => {
  subscribesArr.push(cb);
};

// 用新token发起请求
const reloadSubscribesArr = (token) => {
  subscribesArr.map(cb => cb(token));
};

// 开始加载
export const startLoading = () => {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.2)'
  });
};

let needLoadingRequestCount = 0;

export const showFullScreenLoading = () => {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
};

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

// create an axios instance
const service = axios.create({
  baseURL: '',
  timeout: 20000 // request timeout
});

service.interceptors.request.use(
  config => {
    // 如果是不需要token的接口直接返回即可
    if (config.url.indexOf('/login') > 0) {
      return config;
    }
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    // 获取token
    // const token = localStorage.getItem('token');
    // const refreshToken = localStorage.getItem('refreshToken');

    /**
     *  如果 refreshToken 过期重新登录
     *  如果 token 过期 更新token
     */
    // if (!refreshToken || !isRefreshTokenExpired(refreshToken)) {
    //   if (!token || isTokenExpired(token)) {
    //     if (!window.isRefreshing) {
    //       window.isRefreshing = true;
    //       post('/api/auth/token', { refreshToken })
    //         .then((res) => {
    //           window.isRefreshing = false;
    //           if (res && JSON.stringify(res) !== '{}') {
    //             store.commit('user/SET_TOKEN', res);
    //             reloadSubscribesArr(res.token);
    //           } else {
    //             subscribesArr = [];
    //             directLogin();
    //           }
    //         })
    //         .catch((error) => {
    //           if (error.request.status === 401) {
    //             message('warning', '登录超时，请重新登录！');
    //           } else {
    //             message('error', error.message);
    //           }
    //           console.log('err2', error);
    //           subscribesArr = [];
    //           window.isRefreshing = false;
    //           directLogin();
    //         });
    //     }

    //     const retry = new Promise((resolve, reject) => {
    //       subscribeTokenRefresh((token) => {
    //         config.headers['x-Authorization'] = `Bearer ${token}`;
    //         resolve(config);
    //       });
    //     });
    //     return retry;

    //   } else {
    //     config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    //     config.headers['x-Authorization'] = `Bearer ${token}`;
    //     return config;
    //   }
    // } else {
    //   message('error', '重新登录');
    //   directLogin();
    // }
    showFullScreenLoading();
    config.headers['x-Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';

    return config;
  },
  error => {
    console.log('err3', error);
    message('error', error.message);
    tryHideFullScreenLoading();
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.status === 401) {
      console.log('401');
      directLogin();
    } else if (response.status === 500) {
      message('error', response.error);
    }
    tryHideFullScreenLoading();
    return response.data;
  },
  error => {
    tryHideFullScreenLoading();
    console.log('err5', error.response);
    if (error.response && error.response.status) {
      const err = error.response.data;
      return Promise.reject(err);
    } else if (error && error.stack.indexOf('timeout') > -1) {
      message('error', '请求超时，请稍后重试');
    } else if (error && error.stack.indexOf('Network Error') > -1) {
      message('error', '网络错误，请检查网络连接是否正常');
    } else {
      message('error', '系统错误，请联系管理员');
    }
  }
);

export default service;
