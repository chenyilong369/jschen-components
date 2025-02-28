import { defineComponent, computed, onMounted, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps } from '@/store/index'
import WorksList from '@/components/WorksList.vue'
import useLoadMore from '@/hooks/useLoadMore'
export default defineComponent({
  components: {
    WorksList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const works = computed(() => store.state.templates.works)
    const total = computed(() => store.state.templates.totalWorks)
    const isLoading = computed(() => store.getters.isOpLoading('fetchWorks'))
    const isTemplate = ref(0)
    const searchParams =  computed(() => ({ pageIndex: 0, pageSize: 4, isTemplate: isTemplate.value }))
    onMounted(() => {
      store.dispatch('fetchWorks',  { searchParams: searchParams.value })
    })
    const { isLastPage, loadMorePage, isFirstPage, 
    loadPrevPage, pageIndex, requestParams, goToPage, totalPage } = useLoadMore('fetchWorks', total, searchParams.value)
    const onDelete = (id: number) => {
      store.dispatch('deleteWork', id)
    }
    const onCopy = (id: number) => {
      store.dispatch('copyWork', id).then(({ data }) => {
        router.push(`/editor/${data.id}`)
      })
    }
    const changeCategory = (key: any) => {
      isTemplate.value = key
      pageIndex.value = 0
      requestParams.isTemplate = key
      nextTick(() => {
        store.dispatch('fetchWorks',  { searchParams: searchParams.value })
      })
    }

    return {
      works,
      onDelete,
      onCopy,
      isLoading,
      total,
      changeCategory,
      loadMorePage,
      isLastPage,
      isFirstPage,
      loadPrevPage,
      pageIndex,
      goToPage,
      totalPage
    }
  }
})