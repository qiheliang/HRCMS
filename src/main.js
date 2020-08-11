// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// vuex
import store from './vuex/index'
// babel-polyfill
import 'babel-polyfill'

// element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// css iconfont
import '../static/icon/iconfont.css'
import '../static/css/theme.scss'
import '../static/css/zzl_css.css'
import '../static/css/comment.css'

// 全局
import zzlLang from './assets/providers/lang'
import zzlHttp from './assets/utils/http'
import zzlApi from './assets/providers/api'
import zzlFormat from './assets/utils/format'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.prototype.zzlLang = zzlLang;
Vue.prototype.zzlHttp = zzlHttp;
Vue.prototype.zzlApi = zzlApi;
Vue.prototype.zzlFormat = zzlFormat;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
