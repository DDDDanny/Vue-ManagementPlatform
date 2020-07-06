import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/CSS/global.css'
// 配置axios
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置拦截器
axios.interceptors.request.use(config => {
  // 请求头中挂载Authorization
  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hour = (dt.getHours() + '').padStart(2, '0')
  const minute = (dt.getMinutes() + '').padStart(2, '0')
  const second = (dt.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
