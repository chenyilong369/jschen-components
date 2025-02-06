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
    const handleUploadSuccess: any = (resp: any) => {
      console.log(resp)
      emit('success', { resp })
    }
    return () => (
      <Uploader
        action="http://127.0.0.1:3000/api/utils/updateToCos"
        class="styled-uploader"
        showUploadList={false}
        beforeUpload={commonUploadCheck}
        onSuccess={(data: { resp: any }) => handleUploadSuccess(data)}
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
            uploaded: (dataProps: { successData: { url: string } }) => (
              <div class="uploader-container">
                {
                  props.showUploaded ? <img src={ dataProps.successData.url } /> : (
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