import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import '@/styles/Home.scss'
import { GlobalDataProps } from '../store/index'
import TemplateList from '../components/TemplateList.vue'
export default defineComponent({
  components: {
    TemplateList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const testData = computed(() => store.state.templates.data)
    return () => (
      <div class="content-container">
        <template-list list={testData.value}></template-list>
      </div>
    )
  }
})