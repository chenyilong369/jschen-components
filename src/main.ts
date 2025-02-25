import { createApp } from 'vue'
import App from './App'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import JschenBricks from 'jschen-bricks'
import 'jschen-bricks/dist/app.css'
import router from './routes';
import 'cropperjs/dist/cropper.css'
import Antd from 'ant-design-vue';
import store from './store';
import 'ant-design-vue/dist/reset.css';
import { RespData } from './store/respTypes'

export type ICustomAxiosConfig = AxiosRequestConfig & {
  opName?: string;
}

const baseBackendUrl = 'http://127.0.0.1:3000'
const baseH5URL = ''
axios.defaults.baseURL = `${baseBackendUrl}/api/`

axios.interceptors.request.use(config => {
  const newConfig = config as ICustomAxiosConfig
  store.commit('setError', { status: false, message: '' })
  store.commit('startLoading', { opName: newConfig.opName })
  return config
})
axios.interceptors.response.use((resp: AxiosResponse<RespData>) => {
  const { config, data } = resp
  const newConfig = config as ICustomAxiosConfig
  store.commit('finishLoading', { opName: newConfig.opName })
  const { errno, message } = data
  if (errno && errno !== 0) {
    store.commit('setError', { status: true, message })
    return Promise.reject(data)
  }
  return resp
}, (e: AxiosError) => {
  const newConfig = e.config as ICustomAxiosConfig
  store.commit('setError', { status: true, message: '服务器错误' })
  store.commit('finishLoading', { opName: newConfig.opName })
  return Promise.reject(e)
})

createApp(App).use(Antd).use(router).use(store).use(JschenBricks).mount('#app')

export { baseH5URL }
