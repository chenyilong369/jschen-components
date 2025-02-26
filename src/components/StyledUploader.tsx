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
    },
    uploaded: {
      type: Object,
      default: null
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
        action="/utils/updateToCos"
        class="styled-uploader"
        showUploadList={false}
        initUploaded={props.uploaded}
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
            uploaded: ({uploadedData}: { uploadedData: {data: { url: string } }}) => (
              <div class="uploader-container">
                {
                  props.showUploaded ? <img src={ uploadedData.data.url } /> : (
                    <>
                      <FileImageOutlined />
                      <h4>{props.text}</h4>
                    </>
                  )
                }
                {/* {JSON.stringify(uploadedData.successData.url)} */}
              </div>
            )
          }
        }
      </Uploader>
    )
  }
})