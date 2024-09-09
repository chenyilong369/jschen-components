import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import '@/styles/Home.scss'
import { GlobalDataProps } from '../store/index'
import TemplateList from '../components/TemplateList'
import Uploader from '@/components/Uploader'
export default defineComponent({
  components: {
    TemplateList,
    Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const testData = computed(() => store.state.templates.data)
    return () => (
      <div class="content-container">
        <Uploader action="http://127.0.0.1:7001/cos" />
        <template-list list={testData.value}></template-list>
      </div>
    )
  }
})