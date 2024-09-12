import { computed, defineComponent, reactive, ref } from "vue";
import axios from 'axios'
import { v4 } from "uuid";
import '@/styles/components/Uploader.scss'
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue'

type UploadStatus = 'ready' | 'success' | 'error' | 'loading'
interface UploadFile {
  uid: string;
  raw: File;
  size: number;
  name: string;
  status: UploadStatus;
}

export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    }
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined
  },
  setup(props) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const uploadedFiles = ref<UploadFile[]>([])
    const isUploading = computed(() => {
      return uploadedFiles.value.some(item => item.status === 'loading')
    })
    const triggerUpload = () => {
      if (fileInput.value) fileInput.value.click()
    }

    const removeFile = (id: string) => {
      uploadedFiles.value = uploadedFiles.value.filter(item => item.uid !== id)
    }

    const handleChangeFiles = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        const fileObj = reactive<UploadFile>({
          uid: v4(),
          size: uploadedFile.size,
          name: uploadedFile.name,
          status: 'loading',
          raw: uploadedFile
        })
        uploadedFiles.value.push(fileObj)
        formData.append(uploadedFile.name, uploadedFile)

        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          if (resp.data.errorData) {
            fileObj.status = 'error'
          }
          else {
            fileObj.status = 'success'
          }
        }).catch(() => {
          fileObj.status = 'error'
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }

    return () => (
      <div class="file-upload">
        <button onClick={triggerUpload} disabled={isUploading.value}>
          {
            isUploading.value ? <span>正在上传</span> : <span>点击上传</span>
          }
        </button>
        <input ref={fileInput} onChange={(e) => handleChangeFiles(e)} type="file" style={{ display: 'none' }} />
        <ul class="upload-list">
          {
            uploadedFiles.value.map((file) => {
              return (
                <li class={`uploaded-file upload-${file.status}`} key={file.uid}>
                  <span class="file-icon">
                    {
                      file.status === 'loading' ? <LoadingOutlined/> : <FileOutlined/>
                    }
                  </span>
                  <span class="filename">{file.name}</span>
                  <span class="delete-icon" onClick={() => removeFile(file.uid)}><DeleteOutlined /></span>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
})