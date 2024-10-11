import { defineComponent } from 'vue'
import LText from './LText'
import StyledUploader from './StyledUploader'
import { message } from 'ant-design-vue';
import { v4 } from 'uuid';
import { ComponentData } from '@/store/editor';
import { UploadResp } from '@/extraType';
import { imageDefaultProps } from '@/defaultProps';
import { getImageDimensions } from '@/utils/helper';
export default defineComponent({
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  emits: ['itemCreate'],
  name: 'components-list',
  components: {
    LText,
    StyledUploader
  },
  setup(props, context) {
    const onItemClick = (data: any) => {
      const newComponent: ComponentData = {
        id: v4(),
        name: 'l-text',
        props: data
      }
      context.emit("itemCreate", newComponent)
    };
    const onImageUploaded = (data: UploadResp) => {
      console.log(data)
      const { resp } = data
      const newComponent: ComponentData = {
        id: v4(),
        name: 'l-image',
        props: {
          ...imageDefaultProps
        }
      }
      message.success('上传成功')
      newComponent.props.src = 'https://' + resp.successData.Location
      getImageDimensions(resp?.raw).then(({ width }) => {
        console.log(width)
        const maxWidth = 317
        newComponent.props.width = Math.min(maxWidth, width).toString()
        context.emit("itemCreate", newComponent)
      })
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
