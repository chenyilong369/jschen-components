import { defineComponent } from 'vue'
import { message } from 'ant-design-vue'
import ImageProcesser from './ImageProcesser'
import StyledUploader from './StyledUploader'
import { RespUploadData } from '../store/respTypes'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    }
  },
  components: {
    ImageProcesser,
    StyledUploader
  },
  emits: ['change'],
  setup(props, context) {
    const onImageUploaded = (data: { resp: RespUploadData; file: File }) => {
      const { resp } = data
      message.success('上传成功')
      context.emit('change', resp.data.url)
    }
    const handleUploadUrl = (url: string) => {
      context.emit('change', url)
    }
    return () => (
      <>
        <div class="background-processer">
          {
            !props.value ? (
              <styled-uploader
                onSuccess={onImageUploaded}
              />
            ) : (
              <image-processer
                value={props.value}
                onChange={handleUploadUrl}
                showDelete={true}
              />
            )
          }

        </div>
      </>
    )
  }
})