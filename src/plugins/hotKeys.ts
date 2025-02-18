import useHotKeys from "@/hooks/useHoyKeys";
import { GlobalDataProps } from "@/store";
import { computed } from "vue";
import { useStore } from "vuex";

export default function initHotKeys() {
  const store = useStore<GlobalDataProps>()  
  const currentId = computed(() => store.state.editor.currentElement)
  useHotKeys('ctrl+c, command+c', () => {
    store.commit('copyComponent', currentId.value)
  })
  useHotKeys('ctrl+v, command+v', () => {
    store.commit('pasteCopiedComponent')
  })
}