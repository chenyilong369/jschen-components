import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home';
import TemplateDetail from '../views/TemplateDetail';
import store from "@/store";
import axios from "axios";
import Index from "@/views/Index";
import Work from "@/views/Works";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        { path: '', name: 'home', component: Home, meta: {title: '欢迎来到拖拖平台'} },
        { path: 'template/:id', component: TemplateDetail, meta: { title: '模板详情' } },
        { path: 'works', component: Work, meta: { title: '我的作品', requireLogin: true } }
      ],
    },
    {
      path: '/editor/:id',
      name: 'editor',
      component: () => import(/* webpackChunkName: "editor" */ '../views/Editor'),
      meta: {
        notWithHeader: true,
        requiredLogin: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login'),
      meta: { redirectAlreadyLogin: true, title: '登录', disableLoading: true, notWithHeader: true }
    }
  ]
});

router.beforeEach(async (to, from) => {
  const {user} = store.state
  const {token, isLogin} = user
  const { redirectAlreadyLogin, requiredLogin, title } = to.meta

  if (title) {
    document.title = title as string
  }

  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      try {
        await store.dispatch('fetchCurrentUser')
        if (redirectAlreadyLogin) return '/'
      } catch {
        store.commit('logout')
        return '/login'
      }
    } else {
      if (requiredLogin) {
        return '/login'
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      return '/'
    }
  }
})

export default router

