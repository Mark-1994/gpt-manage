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
  Checkbox
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

axios.defaults.baseURL = 'http://47.114.85.4:5001/'
axios.defaults.withCredentials = true
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
Vue.prototype.$http = axios

Vue.prototype.$message = message
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
