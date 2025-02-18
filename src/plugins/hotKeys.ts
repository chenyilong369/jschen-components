import useHotKeys from "@/hooks/useHoyKeys";
import { GlobalDataProps } from "@/store";
import { HotkeysEvent, KeyHandler } from "hotkeys-js";
import { computed } from "vue";
import { useStore } from "vuex";
const wrap = (callback: KeyHandler) => {
  const wrapperFn = (e: KeyboardEvent, event: HotkeysEvent) => {
    e.preventDefault()
    callback(e, event)
  }
  return wrapperFn
}
export default function initHotKeys() {
  const store = useStore<GlobalDataProps>()  
  const currentId = computed(() => store.state.editor.currentElement)
  useHotKeys('ctrl+c, command+c', () => {
    store.commit('copyComponent', currentId.value)
  })
  useHotKeys('ctrl+v, command+v', () => {
    store.commit('pasteCopiedComponent')
  })
  useHotKeys('backspace, delete', () => {
    store.commit('deleteComponent', currentId.value)
  })
  useHotKeys('esc', () => {
    store.commit('setActive', '')
  })
  useHotKeys('up', wrap(() => {
    store.commit('moveComponent', { direction: 'Up', amount: 1, id: currentId.value })
  }))
  useHotKeys('down', wrap(() => {
    store.commit('moveComponent', { direction: 'Down', amount: 1, id: currentId.value})
  }))
  useHotKeys('left', wrap(() => {
    store.commit('moveComponent', { direction: 'Left', amount: 1, id: currentId.value})
  }))
  useHotKeys('right', wrap(() => {
    store.commit('moveComponent', { direction: 'Right', amount: 1, id: currentId.value})
  }))
  useHotKeys('shift+up', () => {
    store.commit('moveComponent', { direction: 'Up', amount: 10, id: currentId.value})
  })
  useHotKeys('shift+down', () => {
    store.commit('moveComponent', { direction: 'Down', amount: 10, id: currentId.value})
  })
  useHotKeys('shift+left', () => {
    store.commit('moveComponent', { direction: 'Left', amount: 10, id: currentId.value})
  })
  useHotKeys('shift+right', () => {
    store.commit('moveComponent', { direction: 'Right', amount: 10, id: currentId.value})
  })
}