import { defineComponent, ref, watch, computed, nextTick } from 'vue'
import useKeyPress from '../hooks/useKeyPress'
import useClickOutside from '../hooks/useClickOutside'
import '@/styles/components/InlineInput.scss'
export default defineComponent({
  name: 'inline-edit',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  emits: ['change'],
  setup(props, context) {
    const innerValue = ref(props.value)
    watch(() => props.value, (newValue) => {
      innerValue.value = newValue
    })
    const wrapper = ref<null | HTMLElement>(null)
    const isOutside = useClickOutside(wrapper)
    const inputRef = ref<null | HTMLInputElement>(null)

    let cachedOldValue = ''
    const isEditing = ref(false)
    const handleClick = (e: Event) => {
      e.stopPropagation()
      isEditing.value = true
    }
    const validateCheck = computed(() => innerValue.value.trim() !== '')
    watch(isEditing, async (isEditing) => {
      if (isEditing) {
        cachedOldValue = innerValue.value
        await nextTick()
        if (inputRef.value) {
          inputRef.value.focus()
        }
      }
    })
    watch(isOutside, (newValue) => {
      if (!validateCheck.value) {
        return
      }
      if (newValue && isEditing.value) {
        isEditing.value = false
        context.emit('change', innerValue.value)
      }
      isOutside.value = false
    })
    useKeyPress('Enter', () => {
      if (!validateCheck.value) {
        return
      }
      if (isEditing.value) {
        isEditing.value = false
        context.emit('change', innerValue.value)
      }
    })
    useKeyPress('Escape', () => {
      if (isEditing.value) {
        isEditing.value = false
        innerValue.value = cachedOldValue
      }
    })
    return {
      handleClick,
      innerValue,
      isEditing,
      wrapper,
      inputRef,
      validateCheck
    }
  },
  render() {
    return (
      <div class="inline-edit" onClick={this.handleClick} ref="wrapper">
        {
          this.isEditing ? (
            <input
              value={this.innerValue}
              onChange={(e: any) => { this.innerValue = e?.target?.value }}
              placeholder="文本不能为空"
              ref="inputRef"
              class={{ 'input-error': !this.validateCheck, 'ant-input': true }}
            />
          ) : (
            <>
              {this.$slots.default?.({ text: this.innerValue })}
            </>
          )
        }
      </div>
    )
  }
})