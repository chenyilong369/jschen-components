import { PropType, defineComponent } from "vue";

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
  setup(props, ctx) {
    return () => (
      <div class="color-picker">
        <div class="native-color-container">
          <input type="color" value={props.value} />
        </div>
      </div>
    )
  },
})
