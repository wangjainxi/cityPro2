/* eslint-disable handle-callback-err */
import axios from 'axios';
import router from '@/router';
import store from '@/store';
import * as types from '@/store/getters';
import { Loading } from 'element-ui';

// 默认超时时间
axios.defaults.timeout = 10000;

// 相对路径设置
axios.defaults.baseURL = '';

let loading;

// 开始加载
function startLoading() {

  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.2)'
  });

}

// 结束加载
function endLoading() {

  loading.close();

}

let needLoadingRequestCount = 0;

export function showFullScreenLoading() {

  if (needLoadingRequestCount === 0) {

    startLoading();

  }
  needLoadingRequestCount++;

}

export function tryHideFullScreenLoading() {

  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {

    endLoading();

  }

}

// 是否有请求在刷新token
window.isRefreshing = false;
// 被挂起的请求数组
let subscribesArr = [];

// push所有请求到数组中
function subscribeTokenRefresh(cb) {

  subscribesArr.push(cb);

}

// 用新token发起请求
function reloadSubscribesArr(token) {

  subscribesArr.map(cb => cb(token));

}

/**
 * 快过期了 和 已经过期了
 * @returns {boolean}
 */
function isTokenExpired() {
  // debugger
  const expiredTime = store.state.expirationTime;
  if (expiredTime) {

    const nowTime = new Date().getTime();
    const willExpired = (expiredTime - nowTime) / 1000 < 10 * 60;
    return willExpired;

  }
  return false;

}

function directLogin() {

  router.push({
    path: '/home',
    query: {
      redirectUrl: window.location.href.split('#')[1] || ''
    }
  });

}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // debugger;

    // 设置参数
    if (!config.headers['Content-Type']) {

      config.headers = {
        'Content-Type': 'application/json'
      };

    }
    // 如果是不需要token的接口直接返回即可
    if (config.url.startsWith('/blog/open') || config.url === '/blog/login') {

      return config;

    }

    // 获取token
    const token = store.state.accessToken;
    // 如果token存在，首先校验是否已经过期，如果已经过期，跳转到登录页面
    if (token) {

      const refreshToken = store.state.refreshToken;
      if (isTokenExpired() && config.url.indexOf('/admin/') > -1) {

        if (!window.isRefreshing) {

          window.isRefreshing = true;
          post('/blog/refresh/token', { refreshToken: refreshToken })
            .then((res) => {

              window.isRefreshing = false;
              if (res.code === 200) {

                const tokenVo = res.data;
                store.dispatch('setTokenInfo', tokenVo);
                reloadSubscribesArr(tokenVo.token);

              } else {

                subscribesArr = [];
                window.localStorage.clear();
                directLogin();

              }

            })
            .catch((err) => {

              window.isRefreshing = false;
              subscribesArr = [];
              window.localStorage.clear();
              directLogin();

            });

        }
        const retry = new Promise((resolve, reject) => {

          subscribeTokenRefresh((newToken) => {

            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(config);

          });

        });
        return retry;

      } else {

        config.headers.Authorization = `Bearer ${token}`;
        return config;

      }

    } else {

      directLogin();

    }
    // // 鉴权参数
    // if (config.method === 'get') {
    //     // get请求下 参数在params中，其他请求在dada中
    //     config.params = config.params || {}
    //     // let json = JSON.parse(JSON.stringify(config.params))
    //     // 一些参数处理
    // } else {
    //     config.data = config.data || {}
    //     // 一些参数处理
    // }
    showFullScreenLoading();
    return config;

  },
  err => {

    tryHideFullScreenLoading();
    return Promise.reject(err);

  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {

    // 统一code处理
    if (response.status === 401) {

      window.localStorage.clear();
      router.push({
        name: '/home',
        query: {
          redirectUrl: window.location.href.split('#')[1] || '',
          is_new_user_url: 1
        }
      });

    } else if (response.status === 500) {

      this.$message.error(response.error);

    }
    tryHideFullScreenLoading();
    return response;

  },
  error => {

    if (error.response) {

      switch (error.response.status) {

        case 401:
          store.commit(types.SET_LOGIN_STATUS, false);
          store.commit(types.REMOVE_TOKEN_INFO);
          router.replace({
            path: '/home',
            query: { redirect: router.currentRoute.fullPath }
          });

      }

    }
    tryHideFullScreenLoading();
    return Promise.reject(error.response.data);

  }
);

export function put(url, data = {}) {

  return new Promise((resolve, reject) => {

    axios.put(url, data)
      .then(response => {

        if (response.status === 200) {

          resolve(response.data);

        } else {

          this.$message.error(response.statusText);

        }

      }, err => {

        reject(err);

      });

  });

}

export function post(url, data = {}) {

  return new Promise((resolve, reject) => {

    axios.post(url, data)
      .then(response => {

        if (response.status === 200) {

          resolve(response.data);

        } else {

          this.$message.error(response.statusText);

        }

      }, err => {

        reject(err);

      });

  });

}

export function get(url, data = {}) {

  return new Promise((resolve, reject) => {

    axios.get(url, data)
      .then(response => {

        if (response.status === 200) {

          resolve(response.data);

        } else {

          this.$message.error(response.statusText);

        }

      }, err => {

        reject(err);

      });

  });

}

export function del(url, data = {}) {

  return new Promise((resolve, reject) => {

    axios.delete(url, data)
      .then(response => {

        if (response.status === 200) {

          resolve(response.data);

        } else {

          this.$message.error(response.statusText);

        }

      }, err => {

        reject(err);

      });

  });

}

export function form(url, formData = {}) {

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  return new Promise((resolve, reject) => {

    axios.post(url, formData, config)
      .then(response => {

        if (response.status === 200) {

          resolve(response.data);

        } else {

          this.$message.error(response.statusText);

        }

      }, err => {

        reject(err);

      });

  });

}
