import { createApp } from 'vue'
import App from './App.tsx'
import router from './routes';
import Antd from 'ant-design-vue';
import store from './store';
import 'ant-design-vue/dist/reset.css';

createApp(App).use(Antd).use(router).use(store).mount('#app')
