import { computed, defineComponent, nextTick, ref, withModifiers } from 'vue'
import '@/styles/components/EditWrapper.scss'
import { pick } from 'lodash-es'

type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface OriginalPositions {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object
    }
  },
  emits: ['setActive', 'updatePosition'],
  setup(props, { emit }) {
    const editWrapper = ref<null | HTMLElement>(null)
    // 保存相对偏移量
    const gap = {
      x: 0,
      y: 0
    }
    let isMoving = false
    const onItemClick = (id: string) => {
      emit('setActive', id)
    }
    const caculateMovePosition = (e: MouseEvent) => {
      const container = document.getElementById('canvas-area') as HTMLElement
      const left = e.clientX - gap.x - container.offsetLeft
      const top = e.clientY - gap.y - container.offsetTop + container.scrollTop
      return {
        left,
        top
      }
    }

    // 计算大小
    const caculateSize = (direction: ResizeDirection, e: MouseEvent, positions: OriginalPositions) => {
      const { clientX, clientY } = e
      const { left, right, top, bottom } = positions
      const container = document.getElementById('canvas-area') as HTMLElement
      const rightWidth = clientX - left
      const leftWidth = right - clientX
      const bottomHeight = clientY - top
      const topHeight = bottom - clientY
      const topOffset = clientY - container.offsetTop + container.scrollTop
      const leftOffset = clientX - container.offsetLeft
      switch (direction) {
        case 'top-left':
          return {
            width: leftWidth,
            height: topHeight,
            top: topOffset,
            left: leftOffset
          }
        case 'top-right':
          return {
            width: rightWidth,
            height: topHeight,
            top: topOffset
          }
        case 'bottom-left':
          return {
            width: leftWidth,
            height: bottomHeight,
            left: leftOffset
          }
        case 'bottom-right':
          return {
            width: rightWidth,
            height: bottomHeight
          }
        default:
          break
      }
    }

    const startResize = (direction: ResizeDirection) => {
      const currentElement = editWrapper.value as HTMLElement
      const { left, right, top, bottom } = currentElement.getBoundingClientRect()
      const handleMove = (e: MouseEvent) => {
        const size = caculateSize(direction, e, { left, right, top, bottom })
        const { style } = currentElement
        if (size) {
          style.width = size.width + 'px'
          style.height = size.height + 'px'
          if (size.left) {
            style.left = size.left + 'px'
          }
          if (size.top) {
            style.top = size.top + 'px'
          }
        }
      }
      
      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMove)
        const size = caculateSize(direction, e, { left, right, top, bottom })
        emit('updatePosition', { ...size, id: props.id })
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const startMove = (e: MouseEvent) => {
      const currentElement = editWrapper.value
      if (currentElement) {
        const { left, top } = currentElement.getBoundingClientRect()
        gap.x = e.clientX - left
        gap.y = e.clientY - top
      }
      const handleMove = (e: MouseEvent) => {
        const { left, top } = caculateMovePosition(e)
        isMoving = true
        if (currentElement) {
          currentElement.style.top = top + 'px'
          currentElement.style.left = left + 'px'
        }
      }
      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', handleMove)
        if (isMoving) {
          const { left, top } = caculateMovePosition(e)
          emit('updatePosition', { left, top, id: props.id })
          isMoving = false
        }
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const styles = computed(() => pick(props.props, ['position', 'top', 'left', 'width', 'height']))
    return {
      onItemClick,
      styles,
      editWrapper,
      startMove,
      startResize
    }
  },
  render() {
    return (
      <div
        ref="editWrapper"
        onClick={() => this.onItemClick(this.$props.id)}
        style={this.styles}
        data-component-id={this.$props.id}
        onMousedown={(e)=> this.startMove(e)}
        class={{ "edit-wrapper": true, active: this.$props.active, hidden: this.$props.hidden }}
      >
        {this.$slots.default && this.$slots.default()}
        <div class="resizers">
          <div class='resizer top-left' onMousedown={withModifiers(() => this.startResize('top-left'), ['stop'])}></div>
          <div class='resizer top-right' onMousedown={withModifiers(() => this.startResize('top-right'), ['stop'])}></div>
          <div class='resizer bottom-left' onMousedown={withModifiers(() => this.startResize('bottom-left'), ['stop'])}></div>
          <div class='resizer bottom-right' onMousedown={withModifiers(() => this.startResize('bottom-right'), ['stop'])}></div>
        </div>
      </div>
    )
  }
})
