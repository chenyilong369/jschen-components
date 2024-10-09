import { defineComponent } from "vue";
import Uploader from "./Uploader";
import '@/styles/components/StyleUploader.scss'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { commonUploadCheck } from "@/utils/helper";

export default defineComponent({
  props: {
    text: {
      type: String,
      default: '上传图片'
    },
    showUploaded: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Uploader,
    FileImageOutlined,
    LoadingOutlined,
  },
  emits: ['success'],
  setup(props, { emit }) {
    const handleUploadSuccess = (resp: any, file: File) => {
      emit('success', { resp, file })
    }
    return () => (
      <Uploader
        action="http://127.0.0.1:7001/cos"
        showUploadList={false}
        beforeUpload={commonUploadCheck}
        onSuccess={(data: { resp: any; file: { raw: File } }) => handleUploadSuccess(data.resp, data.file.raw)}
      >
        {
          {
            default: () => (
              <div class="uploader-container">
                <FileImageOutlined />
                <h4>{props.text}</h4>
              </div>
            ),
            loading: () => (
              <div class="uploader-container">
                <FileImageOutlined />
                <h4>{props.text}</h4>
              </div>
            ),
            uploaded: (dataProps: { successData: { Location: string } }) => (
              <div class="uploader-container">
                {
                  props.showUploaded ? <img src={'https://' + dataProps.successData.Location} /> : (
                    <>
                      <FileImageOutlined />
                      <h4>{props.text}</h4>
                    </>
                  )
                }
              </div>
            )
          }
        }
      </Uploader>
    )
  }
})