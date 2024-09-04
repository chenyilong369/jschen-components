import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import '@/styles/Index.scss'
import { GlobalDataProps } from '../store/index'
import UserProfile from '../components/UserProfile'
export default defineComponent({
  name: 'Index',
  components: {
    UserProfile
  },
  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const withHeader = computed(() => route.meta.withHeader)
    const user = computed(() => store.state.user)
    return () => (
      <>
        {
          withHeader.value ? (
            <div class="homepage-container">
              <a-layout style={{ background: '#fff' }}>
                <a-layout-header class="header">
                  <router-link to="/">
                    <div class="page-title">
                      JSCHEN乐高
                    </div>
                  </router-link>
                  <UserProfile user={user.value} />

                </a-layout-header>
                <a-layout-content class="home-layout">
                  <router-view />
                </a-layout-content>
              </a-layout>
              <a-layout-footer>
                © xxx版权所有 | 津ICP备xxx
              </a-layout-footer>
            </div>
          ) : <router-view />
        }
      </>
    )
  }
})
