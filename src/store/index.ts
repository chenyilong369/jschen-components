import {ActionContext, createStore} from 'vuex'
import templates, { TemplatesProps } from './templates';
import { compile } from 'path-to-regexp'
import user, {UserProps} from './user';
import editor, {EditorProps} from './editor';
import global, { GlobalStatus } from './global'
import axios, { AxiosRequestConfig } from 'axios';
import { forEach } from 'lodash-es';
import { message } from 'ant-design-vue';

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
  global: GlobalStatus;
}

export interface ActionPayload {
  urlParams?: { [key: string]: any };
  data?: any;
  searchParams?: { [key: string]: any };
  successMessage?: string;
}

export function actionWrapper(url: string, commitName: string, config: AxiosRequestConfig = { method: 'get'}) {
  return async (context: ActionContext<any, any>, payload: ActionPayload = {}) => {
    const { urlParams, data, searchParams, successMessage } = payload
    const newConfig = { ...config, data, opName: commitName }
    let newURL = url
    if (urlParams) {
      const toPath = compile(url, { encode: encodeURIComponent })
      newURL = toPath(urlParams)
      console.log(newURL)
    }
    if (searchParams) {
      const search = new URLSearchParams()
      forEach(searchParams, (value, key) => {
        search.append(key, value)
      })
      newURL += '?' + search.toString()
      // 另外一种方式
      // newURL += '?' + objToQueryString(searchParams)
    }
    console.log(newURL)
    const resp = await axios(newURL, newConfig)
    successMessage && message.success(successMessage)
    context.commit(commitName, { payload ,...resp.data})
    return resp.data
  }
}

const store = createStore<GlobalDataProps>({
  modules: {
    templates,user,editor,global
  },
})

export default store

