import { ComponentData } from "@/store/editor";
import { defineComponent, PropType } from "vue";
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, DragOutlined } from '@ant-design/icons-vue'
import '@/styles/components/LayerList.scss'
import InlineInput from './InlineInput'

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<ComponentData[]>,
      required: true
    },
    selectedId: {
      type: String,
      required: true
    }
  },
  components: {
    InlineInput
  },
  emits: ['select', 'change', 'drop'],
  setup(props, context) {

    const handleClick = (id: string) => {
      context.emit('select', id)
    }

    const handleChange = (id: string, key: string, value: boolean) => {
      const data = {
        id,
        key,
        value,
        isRoot: true
      }
      context.emit('change', data)
    }

    return () => (
      <ul class="ant-list-items ant-list-bordered">
        {
          props?.list && props.list.map(element => (
            <li
              class={element.id === props.selectedId ? 'active ant-list-item' : 'ant-list-item'}
              onClick={() => handleClick(element.id)}
            >
              <a-tooltip title={element.isHidden ? '显示' : '隐藏'}>
                <a-button shape="circle" onClick={() => handleChange(element.id, 'isHidden', !element.isHidden)}>
                  {
                    {
                      icon: () => element.isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />,
                      default: () => ''
                    }
                  }
                </a-button>
              </a-tooltip>
              <a-tooltip title={element.isLocked ? '解锁' : '锁定'}>
                <a-button shape="circle" onClick={() => handleChange(element.id, 'isLocked', !element.isLocked)}>
                  {
                    {
                      icon: () => element.isLocked ? <UnlockOutlined /> : <LockOutlined />,
                      default: () => ''
                    }
                  }
                </a-button>
              </a-tooltip>
              <inline-input class="edit-area" value={element.layerName} onChange={(value: boolean) => { handleChange(element.id, 'layerName', value) }}>
                {{
                  default: ({text}: any) => <span>{ text }</span>
                }}
              </inline-input>
            </li>
          ))
        }
      </ul>
    )
  }
})