import { defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import { RouterLink, useRouter } from 'vue-router'
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
  setup(props) {
    const store = useStore<UserProps>()
    const router = useRouter()
    const logout = () => {
      store.commit('logout')
      message.success('登出成功', 2)
      setTimeout(() => {
        router.push('/')
      }, 2000);
    }
    return () => (
      <>
        {
          !props.user?.isLogin ? (
            <RouterLink to="/login">
              <a-button type="primary" class="user-profile-component">
                登录
              </a-button>
            </RouterLink>
          ) : (
            <a-dropdown-button class="user-profile-component" v-slots={{
              overlay: () => (
                <a-menu class="user-profile-dropdown">
                  <a-menu-item key="0" onClick={logout}>登出</a-menu-item>
                </a-menu>
              )
            }}>
              <router-link to="/setting">{props.user.data && props.user.data.nickName}</router-link>
            </a-dropdown-button>
          )
        }
      </>
    )
  }
})
