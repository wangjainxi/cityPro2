import router from './router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import getPageTitle from '@/utils/get-page-title';
import store from '@/store';
import Vue from 'vue';
NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login']; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  if (store.getters.isShowEdit) {
    next(false);
    setTimeout(() => {
      new Vue().$confirm('修改还未保存,确认离开吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next();
        store.commit('net/CHANGE_EDIT', false);
      }).catch(() => {
        next(false);
      });
    }, 0);
  } else {
    // start progress bar
    NProgress.start();
    next();
    // set page title
    document.title = getPageTitle(to.meta.title);
    // determine whether the user has logged in
    // const hasToken = localStorage.getItem('refreshToken');

    // if (hasToken) {
    //   if (to.path === '/login') {
    //   // if is logged in, redirect to the home page
    //     next({ path: '/dashboard' });
    //   }

    // } else {

    //   /* has no token*/
    //   if (whiteList.indexOf(to.path) !== -1) {

    //     // in the free login whitelist, go directly
    //     next();

    //   } else {
    //   // other pages that do not have permission to access are redirected to the login page.
    //     next(`/login?redirect=${to.path}`);

    //   }
    //   NProgress.done();

    // }
  }
});

router.afterEach(() => {

  // finish progress bar
  NProgress.done();

});
