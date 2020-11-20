import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Users from '../components/user/Users.vue'
import Add from '../components/manage/Add.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: 'users',
    children: [{
      path: '/users',
      component: Users
    }, {
      path: '/add',
      component: Add
    }]
  }
]

const router = new VueRouter({
  routes
})

export default router
