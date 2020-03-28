
function plugin (Vue) {

  if (plugin.installed) {

    return;

  }

  Vue.token = ss;
  Object.defineProperties(Vue.prototype, {
    $token: {
      get () {
        return ss;
      }
    }
  });

}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;
