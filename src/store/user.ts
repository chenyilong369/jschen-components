import { actionWrapper, GlobalDataProps } from ".";
import { Module } from "vuex";
import { RespData } from "./respTypes";
import axios from "axios";

export interface UserProps {
  isLogin: boolean;
  token?: string;
  data: UserDataProps;
}

export interface UserDataProps {
  username?: string;
  id?: string;
  phoneNumber?: string;
  nickName?: string;
  description?: string;
  updatedAt?: string;
  createdAt?: string;
  iat?: number;
  exp?: number;
  picture?: string;
  gender?: string;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
    data: {},
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    login(state, rawData: RespData<{ token: string }>) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout(state) {
      state.token = ''
      state.isLogin = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    fetchCurrentUser(state, rawData: RespData<UserDataProps>) {
      state.isLogin = true
      state.data = { ...rawData.data }
    },
  },
  actions: {
    login: actionWrapper('/users/loginByPassword', 'login', { method: 'post'}),
    fetchCurrentUser: actionWrapper('/users/getUserInfo', 'fetchCurrentUser'),
    async loginAndFetch({ dispatch }, loginData) {
      await dispatch('login', loginData);
      return dispatch('fetchCurrentUser');
    }  
  }
}

export default user