import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import createContextMenu, { ActionItem } from '../components/createContextMenu'
const initContextMenu = () => {
  const store = useStore()
  const testActions: ActionItem[] = [
    { shortcut: 'Backspace / Delete', text: '删除图层', action: (cid) => { store.commit('deleteComponent', cid) }},
    { shortcut: 'Ctrl+C', text: '复制图层', action: (cid) => { store.commit('copyComponent', cid) }},
  ]

  const testActions2: ActionItem[] = [
    { shortcut: 'Ctrl+V', text: '粘贴图层', action: () => { store.commit('pasteCopiedComponent') }}
  ]
  let destory: any, destory2: any
  onMounted(() => {
    destory = createContextMenu(testActions)
    destory2 = createContextMenu(testActions2, 'body-container')
  })
  onUnmounted(() => {
    destory()
    destory2()
  })
}

export default initContextMenu