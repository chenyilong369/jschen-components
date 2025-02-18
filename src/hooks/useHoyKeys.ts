import hotkeys, { KeyHandler } from "hotkeys-js";
import { onMounted, onUnmounted } from "vue";

const useHotKeys = (keys: string, callback: KeyHandler) => {
  onMounted(() => {
    hotkeys(keys, callback)
  })
  onUnmounted(() => {
    hotkeys.unbind(keys, callback)
  })
}

export default useHotKeys
