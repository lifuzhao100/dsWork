/**
 * @Author: lifuzhao
 * @Date: 2019-11-2019-11-27 21:52
 * @Project: dsWork
 */
import Vue from 'vue'
import VueRouter from "vue-router";
import store from '../store'
import fn from '../plugins/fn'

Vue.use(VueRouter)

let state = store.state
const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/record'
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login-index" */ '../views/login/index.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/record/:recordOperate?',
      component: () => import(/* webpackChunkName: "record-index" */ '../views/record/index.vue'),
      meta: {
        title: '登记列表'
      }
    },
    {
      path: '/schedule/:scheduleOperate?',
      component: () => import(/* webpackChunkName: "schedule-index" */ '../views/schedule/index.vue'),
      meta: {
        title: '定时列表'
      }
    },
    {
      path: '/email',
      component: () => import(/* webpackChunkName: "email-index" */ '../views/email/index.vue'),
      meta: {
        title: '邮件通知'
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  let {path, meta} = to
  fn.setTitle(meta.title)
  if (path !== '/login') {
    if (!state.user.username || !state.user.password) {
      next('/login')
    }
  }
  next()
})
export default router
