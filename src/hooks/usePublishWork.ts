import { useRoute } from "vue-router";
import useSaveWork from "./useSaveWork";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store";
import { computed, ref } from "vue";
import { takeScreenshotAndUpload } from "@/utils/helper";

function usePublishWork() {
  const { saveWork } = useSaveWork(true)
  const route = useRoute()
  const store = useStore<GlobalDataProps>()
  const channels = computed(() => store.state.editor.channels)
  const currentWorkId = route.params.id
  const isPublishing = ref(false)

  const publishWork = async (el: HTMLElement) => {
    try {
      isPublishing.value = true
      const resp = await takeScreenshotAndUpload(el)
      if (resp) {
        store.commit('updatePage', { key: 'coverImg', value: resp.data.url, isRoot: true })
        await saveWork(true)
        await store.dispatch('publishWork', { urlParams: { id: currentWorkId } })
        await store.dispatch('fetchChannels', { urlParams: { id: currentWorkId } })
        if (channels.value.length === 0) {
          await store.dispatch('createChannel', { data: { name: '默认', workId: parseInt(currentWorkId as string) } })
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      isPublishing.value = false
    }
  }

  return {
    publishWork,
    isPublishing
  }
}

export default usePublishWork