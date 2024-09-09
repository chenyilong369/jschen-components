import { defineComponent, ref } from "vue";
import axios from 'axios'

export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null)
    type UploadStatus = 'ready' | 'success' | 'error' | 'loading'
    const fileStatus = ref<UploadStatus>('ready')
    const triggerUpload = () => {
      if (fileInput.value) fileInput.value.click()
    }

    const handleChangeFiles = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        fileStatus.value = 'loading'
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)

        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          if (resp.data.errorData) {
            fileStatus.value = 'error'
          }
          else fileStatus.value = 'success'
        }).catch(() => {
          fileStatus.value = 'error'
        })
      }
    }

    return () => (
      <div class="file-upload">
        <button onClick={triggerUpload}>
          {
            (() => {
              switch (fileStatus.value) {
                case 'loading':
                  return (<span>正在上传</span>)
                case 'error':
                  return (<span>上传失败</span>)
                case 'success':
                  return (<span>上传成功</span>)
                default:
                  return (<span>点击上传</span>)
              }
            })()
          }
        </button>
        <input ref={fileInput} onChange={(e) => handleChangeFiles(e)} type="file" style={{ display: 'none' }} />
      </div>
    )
  }
})