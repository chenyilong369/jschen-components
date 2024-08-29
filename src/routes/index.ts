import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.tsx';
import Editor from '../views/Editor.tsx';
import TemplateDetail from '../views/TemplateDetail.tsx';

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
        withHeader: false
      }
    },
    {
      path: '/template/:id',
      name: 'template',
      component: TemplateDetail,
      meta: {
        withHeader: true 
      }
    }
  ]
});

export default router

