import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Users from '../components/user/Users.vue'
import Add from '../components/manage/Add.vue'
import List from '../components/manage/List.vue'
import Deal from '../components/manage/Deal.vue'
import Modelslist from '../components/articleModel/Modelslist.vue'
import Apimanage from '../components/apiInterface/Apimanage.vue'

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
    }, {
      path: '/list',
      component: List
    }, {
      path: '/deal',
      component: Deal
    }, {
      path: '/modelslist',
      component: Modelslist
    }, {
      path: '/apimanage',
      component: Apimanage
    }]
  }
]

const router = new VueRouter({
  routes
})

export default router
