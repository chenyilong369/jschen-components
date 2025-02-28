import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import '@/styles/Home.scss'
import { GlobalDataProps } from '../store/index'
import TemplateList from '../components/TemplateList'
import Uploader from '@/components/Uploader'
import useLoadMore from '@/hooks/useLoadMore'
export default defineComponent({
  components: {
    TemplateList,
    Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const testData = computed(() => store.state.templates.data)
    const total = computed(() => store.state.templates.totalTemplates)
    const isLoading = computed(() => store.getters.isOpLoading('fetchTemplates'))

    const { loadMorePage, isLastPage } = useLoadMore('fetchTemplates', total, { pageIndex: 0, pageSize: 4 })

    onMounted(() => {
      store.dispatch('fetchTemplates', { searchParams: { pageIndex: 0, pageSize: 8 } })
    })
    return () => (
      <div class="content-container">
        <a-row gutter={16}>
          <template-list list={testData.value}></template-list>
        </a-row>
        <a-row type="flex" justify="center">
          {
            !isLastPage ? <a-button type="primary" size="large" onClick={loadMorePage} loading={isLoading.value}></a-button> : null
          }
        </a-row>
      </div>
    )
  }
})