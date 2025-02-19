import { defineComponent, onMounted, ref, onUnmounted, PropType } from 'vue'
import { getParentElement } from '@/utils/helper'
import { ActionItem } from './createContextMenu'
import '@/styles/components/ContextMenu.scss'

export default defineComponent({
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      required: true
    },
    triggerClass: {
      type: String,
      default: 'edit-wrapper'
    }
  },
  setup(props, context) {
    const menuRef = ref<HTMLElement | null>(null)
    const componentId = ref('')
    const triggerContextMenu = (e: MouseEvent) => {
      const domElement = menuRef.value as HTMLElement
      const wrapperElement = getParentElement(e.target as HTMLElement, props.triggerClass)
      if (wrapperElement) {
        e.preventDefault()
        domElement.style.display = 'block'
        domElement.style.top = e.pageY + 'px'
        domElement.style.left = e.pageX + 'px'
        const cid = wrapperElement.dataset.componentId
        console.log(cid)
        if (cid) {
          componentId.value = cid
        }
      }
    }
    const handleClick = () => {
      const domElement = menuRef.value as HTMLElement
      domElement.style.display = 'none'
    }
    onMounted(() => {
      document.addEventListener('contextmenu', triggerContextMenu)
      document.addEventListener('click', handleClick)
    })

    onUnmounted(() => {
      console.log('removed')
      document.removeEventListener('contextmenu', triggerContextMenu)
      document.removeEventListener('click', handleClick)
    })
    return {
      menuRef,
      componentId
    }
  },
  render() {
    return (
      <div class="context-menu-component menu-container" ref="menuRef">
        <div class="list-container">
          {
            this.$props.actions.map((action, index) => {
              return (
                <div key={index} onClick={() => action.action(this.componentId)} class="ant-menu-item">
                  <span class="item-text">{action.text}</span>
                  <span class="item-shortcut">{action.shortcut}</span>
                </div>
              )
            })
          }

        </div>
      </div >
    )
  }
})