<template>
  <a-button type="primary" v-if="!user?.isLogin" class="user-profile-component" @click="login">
    登录
  </a-button>
  <div v-else>
    <a-dropdown-button>
      <router-link to="/setting">{{ user.userName }}</router-link>
      <template v-slot:overlay>
        <a-menu>
          <a-menu-item key="0" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserProps } from '../store/user'
export default defineComponent({
  name: 'user-profile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      require: true
    }
  },
  setup() {
    const store = useStore<UserProps>()
    const router = useRouter()
    const login = () => {
      store.commit('login')
      message.success('登录成功', 2)
    }
    const logout = () => {
      store.commit('logout')
      message.success('登出成功', 2)
      setTimeout(() => {
        router.push('/')
      }, 2000);
    }
    return {
      login,
      logout
    }
  }
})
</script>

<style lang="scss" scoped></style>
