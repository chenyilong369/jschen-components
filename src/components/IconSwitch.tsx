import { defineComponent, h, resolveComponent } from 'vue'
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined
  },
  props: {
    iconName: {
      type: String,
      required: true
    },
    checked: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String
    }
  },
  emits: ['change'],
  setup(props, context) {
    const handleClick = (e: Event) => {
      e.preventDefault()
      context.emit('change', !props.checked)
    }
    return () => (
      <div class="icon-template" onClick={handleClick}>
        <a-tooltip>
          {{
            title: () => <>{props.tip}</>,
            default: () => (
              <a-button type={props.checked ? 'primary' : 'default'} shape="circle">
                {{
                  icon: () => (<>{h(resolveComponent(props.iconName))}</>),
                  default: () => ''
                }}

              </a-button>
            )
          }}

        </a-tooltip>
      </div>
    )
  }
})