import { defineComponent, computed, onMounted, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps } from '@/store/index'
import WorksList from '@/components/WorksList'
import useLoadMore from '@/hooks/useLoadMore'
import { Item } from 'ant-design-vue/es/menu'
import '@/styles/Works.scss'
export default defineComponent({
  components: {
    WorksList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const router = useRouter()
    const works = computed(() => store.state.templates.works)
    const total = computed(() => store.state.templates.totalWorks)
    const isLoading = computed(() => store.getters.isOpLoading('fetchWorks'))
    const isTemplate = ref(0)
    const searchParams = computed(() => ({ pageIndex: 0, pageSize: 4, isTemplate: isTemplate.value }))
    onMounted(() => {
      console.log(1111)
      store.dispatch('fetchWorks', { searchParams: searchParams.value })
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
        store.dispatch('fetchWorks', { searchParams: searchParams.value })
      })
    }

    const pageArr = computed(() => {
      const tmp = []
      for (let i = 1; i <= totalPage.value; i++) {
        tmp.push(i)
      }
      return tmp
    })

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
      totalPage,
      pageArr
    }
  },
  render() {
    return (
      <div class="mywork-container content-container">
        <a-row type="flex" justify="space-between" align="middle" class="poster-title" >
          <h2>我的作品和模版</h2>
        </a-row>
        <a-tabs onChange={(e: any) => this.changeCategory(e)}>
          <a-tab-pane key="0" tab="我的作品">
          </a-tab-pane>
          <a-tab-pane key="1" tab="我的模版">
          </a-tab-pane>
        </a-tabs>
        {
          this.works.length === 0 && !this.isLoading ? (
            <a-empty>
              {{
                description: () => <span> 还没有任何作品 </span>,
                default: () => (
                  <a-button type="primary" size="large">
                    创建你的第一个设计 🎉
                  </a-button>
                )
              }}
            </a-empty>
          ) : null
        }


        <WorksList
          list={this.works} onDelete={this.onDelete}
          onCopy={this.onCopy} loading={this.isLoading}
        >
        </WorksList>
        <a-row  justify="space-between" align="middle">
          <ul class="ant-pagination" style={{display: 'flex'}}>
            <li class={{ 'ant-pagination-disabled': this.isFirstPage, 'ant-pagination-prev': true }}>
              <a-button class="ant-pagination-item-link" onClick={this.loadPrevPage}>
                上一页
              </a-button>
            </li>
            {
              this.pageArr.map(item => (
                <li key={item} class={{ 'ant-pagination-item': true, 'ant-pagination-item-active': (this.pageIndex + 1) === item }}>
                  <a-button onClick={() => this.goToPage(item - 1)}>{item}</a-button>
                </li >
              ))
            }

            <li class={{ 'ant-pagination-next': true, 'ant-pagination-disabled': this.isLastPage }}>
              <a-button class="ant-pagination-item-link" onClick={() => this.loadMorePage()}>
                下一页
              </a-button>
            </li >

          </ul >
          <h2>{this.pageIndex}</h2>
          {
            !this.isFirstPage ? (
              <a-button type="primary" size="large" onClick={() => this.loadPrevPage()} loading={this.isLoading} > 上一页</a-button>
            ) : null
          }

          {
            !this.isLastPage ? (
              <a-button type="primary" size="large" onClick={() => this.loadMorePage()} loading={this.isLoading} > 下一页</a-button>
            ) : null
          }
        </a-row>
      </div >
    )
  }
})