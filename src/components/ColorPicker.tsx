import { PropType, defineComponent, withModifiers } from "vue";
import '@/styles/components/ColorPicker.scss'

const defaultColors = ['#ffffff', '#f5222d', '#fa541c', '#fadb14', '#52c41a', '#1890ff', '#722ed1', '#8c8c8c', '#000000', '']

export default defineComponent({
  name: 'ColorPicker',
  props: {
    value: {
      type: String,
    },
    colors: {
      type: Array as PropType<string[]>,
      default: defaultColors
    }
  },
  emits: ['change'],
  setup(props, ctx) {
    const onChange = (color: string) => {
      ctx.emit('change', color)
    }
    return () => (
      <div class="color-picker">
        <div class="native-color-container">
          <input type="color" value={props.value} onInput={(e) => onChange((e.target as HTMLInputElement).value)}/>
        </div>
        <ul class="picked-color-list">
          {
            props.colors.map((item, index) => (
              <li 
                key={index} 
                class={`item-${index}`} 
                onClick={withModifiers(() => onChange(item), ['prevent'])}
              >
                {
                  item.startsWith('#') ? (
                    <div style={{backgroundColor: item}} class="color-item"></div>
                  ) : (
                    <div class="color-item transparent-back"></div>
                  )
                }
              </li>
            ))
          }
        </ul>
      </div>
    )
  },
})
