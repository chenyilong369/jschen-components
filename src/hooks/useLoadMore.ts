import { computed, ComputedRef, reactive, toRef } from "vue";
import { useStore } from "vuex";

interface LoadParams {
  pageIndex: number;
  pageSize: number;
  [key: string]: any;
}

const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = {pageIndex: 0, pageSize: 8}) => {
  const store = useStore()
  // 只改变页数
  const requestParams = reactive(params)

  const loadMorePage = () => {
    requestParams.pageIndex++
    store.dispatch(actionName, { searchParams: requestParams })
  }

  const goToPage = (index: number) => {
    requestParams.pageIndex = index
    store.dispatch(actionName, { searchParams: requestParams })
  }

  const loadPrevPage = () => {
    requestParams.pageIndex--
    store.dispatch(actionName, { searchParams: requestParams })
  }

  const isFirstPage = computed(() => requestParams.pageIndex === 0)
  const totalPage = computed(() => Math.ceil(total.value / params.pageSize))
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) === requestParams.pageIndex + 1
  })
  const pageIndex = toRef(requestParams, 'pageIndex')
  return {
    loadMorePage,
    isFirstPage,
    goToPage,
    loadPrevPage,
    totalPage,
    pageIndex,
    isLastPage,
    requestParams
  }
}

export default useLoadMore
