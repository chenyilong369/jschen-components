import { computed, defineComponent } from 'vue'
import '@/styles/components/EditWrapper.scss'
import { pick } from 'lodash-es'
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
  emits: ['setActive'],
  setup(props, { slots, emit }) {
    const onItemClick = (id: string) => {
      emit('setActive', id)
    }
    const styles = computed(() => pick(props.props, ['position', 'top', 'left', 'width', 'height']))
    return () => (
      <div 
        onClick={() => onItemClick(props.id)} 
        style={styles.value} 
        class={{ "edit-wrapper": true, active: props.active, hidden: props.hidden }}
      >
        {slots.default && slots.default()}
      </div>
    )
  }
})
