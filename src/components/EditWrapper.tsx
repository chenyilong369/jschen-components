import { defineComponent } from 'vue'
import '@/styles/components/EditWrapper.scss'
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
    }
  },
  emits: ['setActive'],
  setup(props, { slots, emit }) {
    const onItemClick = (id: string) => {
      emit('setActive', id)
    }
    return () => (
      <div onClick={() => onItemClick(props.id)} class={{ "edit-wrapper": true, active: props.active, hidden: props.hidden }}>
        {slots.default && slots.default()}
      </div>
    )
  }
})
