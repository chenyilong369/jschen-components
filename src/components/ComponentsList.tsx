import { defineComponent } from 'vue'
import LText from './LText'
import StyledUploader from './StyledUploader'
import { message } from 'ant-design-vue';
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
    LText,
    StyledUploader
  },
  setup(props, context) {
    const onItemClick = (data: any) => {
      context.emit("itemClick", data)
    };
    const onImageUploaded = (data: { resp: any }) => {
      const { resp } = data
      console.log(resp)
      message.success('上传成功')
    }
    return () => (
      <div class="create-component-list">
        {
          props.list.map((item: any, index) => (
            <div key={index} onClick={() => onItemClick(item)} class="component-wrapper">
              <LText {...item}></LText>
            </div>
          ))
        }
          <StyledUploader onSuccess={onImageUploaded}></StyledUploader>
      </div>
    )
  }
})
