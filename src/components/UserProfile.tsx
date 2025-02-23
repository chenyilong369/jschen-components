import { defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import { RouterLink, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserProps } from '../store/user'
import axios from 'axios'
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
    // 创建作品
    const createDesign = async () => {
      const payload = {
        title: '未命名作品',
        desc: '未命名作品',
        coverImg: 'https://images.pexels.com/photos/27582996/pexels-photo-27582996/free-photo-of-a-statue-of-arco-da-rua-augusto-in-lisbon.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
      }
      const postData = {
        method: 'post', data: payload, opName: 'createDesign'
      } as any
      const { data } = await axios('/works', postData)
      message.success('创建作品成功', 2)
      router.push(`/editor/${data.data.id}`)
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
            <RouterLink to="/login">
              <a-button type="primary" class="user-profile-component">
                登录
              </a-button>
            </RouterLink>
          ) : (
            <a-dropdown-button class="user-profile-component" v-slots={{
              overlay: () => (
                <a-menu class="user-profile-dropdown">
                  <a-menu-item key="0" onClick={createDesign}>创建作品</a-menu-item>
                  <a-menu-item key="1"><router-link to="/works" >我的作品</router-link></a-menu-item>
                  <a-menu-item key="2" onClick={logout}>登出</a-menu-item>
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
