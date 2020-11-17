/*
 * @Author: your name
 * @Date: 2020-03-06 10:58:59
 * @LastEditTime: 2020-03-11 14:29:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import api from '@/api'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

Vue.config.productionTip = false
Vue.prototype.$Api = api
Vue.prototype.$Dayjs = dayjs

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
