import { computed, defineComponent, watch } from 'vue';
import Index from './views/Index'
import { GlobalDataProps } from './store';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import '@/styles/App.scss'

export default defineComponent({
  name: 'App',
  components: {
    Index
  },
  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const isLoading = computed(() => store.getters.isLoading)
    const showLoading = computed(() => isLoading.value && !route.meta.disableLoading)
    const error = computed(() => store.state.global.error)

    watch(() => error.value.status, (newError) => {
      if (newError) {
        message.error(error.value.message || '未知错误', 2)
      }
    })
    return () => (
      <>
        {
          showLoading.value ? (
            <a-spin tip="读取中" class="global-spinner" />
          ): null
        }
        <Index />
      </>

    )
  }
});
