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
  setup(props) {
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
    return () => (
      <>
        {
          !props.user?.isLogin ? (
            <a-button type="primary" class="user-profile-component" onClick={login}>
              登录
            </a-button>
          ) : (
            <a-dropdown-button v-slots={{
              overlay: () => (
                <a-menu>
                  <a-menu-item key="0" onClick={logout}>登出</a-menu-item>
                </a-menu>
              )
            }}>
              <router-link to="/setting">{ props.user.userName }</router-link>
            </a-dropdown-button>
          )
        }
      </>
    )  
  }
})
