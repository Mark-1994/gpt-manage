import Vue from 'vue'
import store from '../store'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Users from '../components/user/Users.vue'
import Score from '../components/user/Score.vue'
import Add from '../components/manage/Add.vue'
import List from '../components/manage/List.vue'
import Deal from '../components/manage/Deal.vue'
import Kwlist from '../components/manage/Kwlist.vue'
import Modelslist from '../components/articleModel/Modelslist.vue'
import Apimanage from '../components/apiInterface/Apimanage.vue'
import Library from '../components/release/Library.vue'
import Configure from '../components/release/Configure.vue'
import Task from '../components/release/Task.vue'
import Clock from '../components/release/Clock.vue'
import Log from '../components/release/Log.vue'
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
    name: 'Home',
    component: Home,
    redirect: 'users',
    children: [{
      path: '/users',
      name: 'Users',
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
      path: '/library',
      component: Library
    }, {
      path: '/configure',
      component: Configure
    }, {
      path: '/clock',
      component: Clock
    }, {
      path: '/share',
      component: Share
    }, {
      path: '/kwlist',
      name: 'Kwlist',
      component: Kwlist
    }, {
      path: '/log',
      component: Log
    }, {
      path: '/task',
      component: Task
    }]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (from.path === '/login') {
    store.commit('from_path_change')
  }
  next()
})

export default router
