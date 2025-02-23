import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home';
import Editor from '../views/Editor';
import TemplateDetail from '../views/TemplateDetail';
import store from "@/store";
import axios from "axios";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        withHeader: true
      }
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
      meta: {
        withHeader: false,
        requiredLogin: true,
      }
    },
    {
      path: '/template/:id',
      name: 'template',
      component: TemplateDetail,
      meta: {
        withHeader: true 
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login'),
      meta: { redirectAlreadyLogin: true, title: '登录', disableLoading: true }
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

