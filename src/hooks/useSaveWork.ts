import { GlobalDataProps } from '@/store'
import { Modal } from 'ant-design-vue'
import { computed, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { useStore } from 'vuex'
const useSaveWork = (disableSiderEffect = false) => {
  const route = useRoute()
  const currentWorkId = route.params.id
  const store = useStore<GlobalDataProps>()
  const saveIsLoading = computed(() => store.getters.isOpLoading('saveWork'))
  const components = computed(() => store.state.editor.components)
  const page = computed(() => store.state.editor.page)
  const isDirty = computed(() => store.state.editor.isDirty)
  let timer: any = 0;

  const saveWork = (hiddenMessage = false) => {
    const { title, props, coverImg } = page.value
    const payload = {
      title,
      coverImg,
      content: {
        props,
        components: components.value
      }
    }
    store.dispatch('saveWork', { data: payload, urlParams: { id: currentWorkId }, successMessage: hiddenMessage ? '' : '保存成功' })
  }

  if (!disableSiderEffect) {
    onMounted(() => {
      if (currentWorkId) {
        store.dispatch('fetchWork', { urlParams: { id: currentWorkId } })
      }
      timer = setInterval(() => {
        isDirty.value && saveWork(true)
      }, 2000)
    })
    onUnmounted(() => {
      clearInterval(timer)
    })

    onBeforeRouteLeave((to, from, next) => {
      if (isDirty.value) {
        Modal.confirm({
          okText: '保存',
          cancelText: '不保存',
          okType: 'primary',
          title: '作品还未保存，是否保存',
          onOk: async () => {
            await saveWork()
            next()
          },
          onCancel: () => next()
        })
      } else next()
    })
  }

  return {
    saveWork,
    saveIsLoading
  }
}

export default useSaveWork
