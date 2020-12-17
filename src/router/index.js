import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Users from '../components/user/Users.vue'
import Score from '../components/user/Score.vue'
import Add from '../components/manage/Add.vue'
import List from '../components/manage/List.vue'
import Deal from '../components/manage/Deal.vue'
import Modelslist from '../components/articleModel/Modelslist.vue'
import Apimanage from '../components/apiInterface/Apimanage.vue'
import Share from '../components/other/Share.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/users'
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
      path: '/score',
      component: Score
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
    }, {
      path: '/share',
      component: Share
    }]
  }
]

const router = new VueRouter({
  routes
})

export default router
