/* eslint-disable no-extend-native */
import axios from 'axios';
import store from '@/store';
import router from '@/router';
import jwtDecode from 'jwt-decode';
import { Message } from 'element-ui';
import dayjs from 'dayjs';
/**
 * 退出登录
 */
export const directLogin = () => {
  store.commit('user/REMOVE_TOKEN');
  router.push({
    path: '/login',
    query: {
      redirectUrl: window.location.href.split('#')[1] || ''
    }
  });
};

/**
 * 快过期了 和 已经过期了
 * @returns {boolean}
 */
export const isTokenExpired = (v) => {
  const expiredTime = jwtDecode(v).exp;
  if (expiredTime) {
    const nowTime = new Date().getTime();
    const willExpired = (expiredTime * 1000 - nowTime) < 2000;
    return willExpired;
  }
  return false;
};

/**
 * 快过期了 和 已经过期了 refreshToken
 * @returns {boolean}
 */
export const isRefreshTokenExpired = () => {
  const expiredTime = store.getters.deRefreshTokenObj.exp;
  if (expiredTime) {
    const nowTime = new Date().getTime();
    const willExpired = (expiredTime * 1000 - nowTime) < 2000;
    return willExpired;
  }
  return false;
};

/**
 * 解析token
 */
export const decodeToken = () => {
  return jwtDecode(store.getters.token);
};

export const goLogin = () => {
  const url = window.location.origin + '/login.html';
  const redirect = window.location.pathname;
  window.localStorage.clear();
  window.localStorage.setItem('redirect', redirect);
  window.location.href = url;
};

export const setTimeoutCustom = (fun, time, that) => {
  const timer = setTimeout(() => {
    fun();
  }, time);
  that.$once('hook:beforeDestroy', () => {
    clearTimeout(timer);
  });
};

export const setIntervalCustom = (fun, time, that) => {
  const timer = setInterval(() => {
    fun();
  }, time);
  that.$once('hook:beforeDestroy', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('destroyTimer', timer);
    }
    clearTimeout(timer);
  });
};

export const toScrollStart = eleId => {
  const eleWraper = document.getElementById(eleId);
  eleWraper.scrollTop = 0;
};
export const toScrollEnd = eleId => {
  const eleWraper = document.getElementById(eleId);
  if (eleWraper) {
    const scrollHeight = eleWraper.scrollHeight;
    eleWraper.scrollTop = scrollHeight;
  }
};

export const formatParam = (paramObj) => {
  let paramsStr = '';
  for (const i in paramObj) {
    if (paramObj[i]) {
      paramsStr += `${i}=${paramObj[i]}&`;
    }
  }
  paramsStr = paramsStr.slice(0, paramsStr.length - 1);
  return paramsStr;
};

export const setWidth = (eleId, that, num) => {
  const eleWidth = document.getElementById(eleId).clientWidth - num;
  that.w = eleWidth + 'px';
};

export const setHeight = (num, that) => {
  that.h = document.getElementsByTagName('body')[0].clientHeight - num + 'px';
};

// 去重
Array.prototype.unique = function() {
  this.sort();
  var re = [this[0]];
  for (var i = 1; i < this.length; i++) {
    if (this[i] !== re[re.length - 1]) {
      re.push(this[i]);
    }
  }
  return re;
};

/**
 *
 * @param {*} url
 * @param {*} data
 */
export const message = (type, message) => {
  return Message({
    message,
    type,
    duration: 5 * 1000
  });
};

/**
 * post 请求封装
 */
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

export const dateFormat = (time, form = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(time).format(form);
};

export function syntaxHighlightJson(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 4);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, function(match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
        match = match.substring(1, match.length - 2) + ':';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

export const debounce = (func, wait) => {
  // 缓存一个定时器id
  let timer = 0;
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

export const throttle = (func, wait) => {
  let lastTime = null;
  let timeout;
  return () => {
    const context = this;
    const now = new Date();
    // eslint-disable-next-line no-undef
    const arg = arguments;
    if (now - lastTime - wait > 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      func.apply(context, arg);
      lastTime = now;
    } else if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(context, arg);
      }, wait);
    }
  };
};

export const sliceBefore = (str, flag) => {
  if (!str) return '';
  return str.slice(0, str.lastIndexOf(flag)).trim() || '';
};

export const sliceAfter = (str, flag) => {
  if (!str) return '';
  return str.slice(str.lastIndexOf(flag) + 1).trim() || '';
};

export const formatRes = (obj) => {
  const tableData = [];
  for (const i in obj) {
    obj[i][0].value.name = i;
    tableData.push(obj[i][0].value);
  }
  return tableData;
};

export const formatTime = (startTime, endTime) => {
  var lefttime = endTime - startTime; // 距离结束时间的毫秒数
  var leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)); // 计算天数
  var lefth = Math.floor(lefttime / (1000 * 60 * 60) % 24); // 计算小时数
  var leftm = Math.floor(lefttime / (1000 * 60) % 60); // 计算分钟数
  var lefts = Math.floor(lefttime / 1000 % 60); // 计算秒数
  const day = leftd ? leftd + '天' : '';
  const hour = lefth ? lefth + '小时' : '';
  const mini = leftm ? leftm + '分' : '';
  const second = lefts ? lefts + '秒' : '';
  return day + hour + mini + second; // 返回倒计时的字符串
};

// export const compare = (o1, o2) => {

//   if (typeof o1 !== typeof o2) {

//     return false;

//   }

//   if (typeof o1.length !== typeof o2.length) {

//     return false;

//   }

//   var bool = true;

//   var keyArr1 = [];
//   var keyArr2 = [];

//   for (var i in o1) {

//     keyArr1.push(i);

//   }

//   for (var i in o2) {

//     keyArr2.push(i);

//   }

//   if (keyArr1.length != keyArr2.length) {

//     return false;

//   }

//   for (var i = 0, k = keyArr2.length; i < k; i++) {

//     keyArr1.push(keyArr2[i]);

//   }

//   var keyArr = keyArr1.unique();

//   for (var i = 0, k = keyArr.length; i < k; i++) {

//     if (keyArr[i] in o1 && keyArr[i] in o2) {

//       if (
//         typeof o1[keyArr[i]] === 'object' &&
//         typeof o2[keyArr[i]] === 'object'
//       ) {

//         bool = compare(o1[keyArr[i]], o2[keyArr[i]]);

//       } else if (o1[keyArr[i]] !== o2[keyArr[i]]) {

//         return false;

//       }

//     } else {

//       return false;

//     }

//   }

//   return bool;

// };
