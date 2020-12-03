import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import {
  Button,
  Layout,
  message,
  Col,
  Row,
  Dropdown,
  Menu,
  Icon,
  List,
  Avatar,
  Progress,
  Table,
  Form,
  Upload,
  Select,
  InputNumber,
  Radio,
  Input,
  Tooltip,
  Checkbox,
  Modal,
  Tag,
  Popconfirm,
  Switch
} from 'ant-design-vue'
Vue.use(Button)
Vue.use(Layout)
Vue.use(Col)
Vue.use(Row)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(List)
Vue.use(Avatar)
Vue.use(Progress)
Vue.use(Table)
Vue.use(Form)
Vue.use(Upload)
Vue.use(Select)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(Input)
Vue.use(Tooltip)
Vue.use(Checkbox)
Vue.use(Modal)
Vue.use(Tag)
Vue.use(Popconfirm)
Vue.use(Switch)

axios.defaults.baseURL = 'http://api.91nlp.cn/'
axios.defaults.withCredentials = true
// axios.defaults.headers = { 'Content-Type': 'multipart/form-data' }
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
Vue.prototype.$http = axios

Vue.prototype.$message = message
Vue.config.productionTip = false

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
