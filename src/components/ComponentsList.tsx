import { defineComponent } from 'vue'
import LText from './LText'
export default defineComponent({
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  emits: ['itemClick'],
  name: 'components-list',
  components: {
    LText
  },
  setup(props, context) {
    const onItemClick = (data: any) => {
      context.emit("itemClick", data)
    };
    return () => (
      <div class="create-component-list">
      {
        props.list.map((item: any, index) => (
          <div key={index} onClick={() => onItemClick(item)} class="component-wrapper">
            <LText {...item}></LText>
          </div>
        )) 
      }
    </div>
    )
  }
})
