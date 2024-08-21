import { GlobalDataProps } from ".";
import { Module } from "vuex";

export interface UserProps {
  isLogin: boolean;
  userName?: string;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false
  },
  mutations: {
    login(state) {
      state.isLogin = true
      state.userName = 'jschen'
    },
    logout(state) {
      state.isLogin = false
    }
  }
}

export default user