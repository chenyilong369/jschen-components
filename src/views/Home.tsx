import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import '@/styles/Home.scss'
import { GlobalDataProps } from '../store/index'
import TemplateList from '../components/TemplateList'
import Uploader from '@/components/Uploader'
import axios from 'axios'
export default defineComponent({
  components: {
    TemplateList,
    Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const testData = computed(() => store.state.templates.data)
    const currentUser = computed(() => store.state.user)

    onMounted(() => {
      store.dispatch('fetchTemplates')
      if (!currentUser.value.isLogin && currentUser.value.token) {
        axios.defaults.headers.common.Authorization = `Bearer ${currentUser.value.token}`
        store.dispatch('fetchCurrentUser').catch(() => {
          localStorage.removeItem('token')
          delete axios.defaults.headers.common.Authorization
        })
      }
    })
    return () => (
      <div class="content-container">
        <template-list list={testData.value}></template-list>
      </div>
    )
  }
})