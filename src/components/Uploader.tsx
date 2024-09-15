import { computed, defineComponent, PropType, reactive, ref } from "vue";
import axios from 'axios'
import { v4 } from "uuid";
import '@/styles/components/Uploader.scss'
import { DeleteOutlined, LoadingOutlined, FileOutlined } from '@ant-design/icons-vue'
import { last } from "lodash";

type UploadStatus = 'ready' | 'success' | 'error' | 'loading'
type CheckUpload = (file: File) => boolean | Promise<File>
interface UploadFile {
  uid: string;
  raw: File;
  size: number;
  name: string;
  status: UploadStatus;
  resp?: any;
}

export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckUpload>
    }
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined
  },
  setup(props, { slots }) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const uploadedFiles = ref<UploadFile[]>([])
    const isUploading = computed(() => {
      return uploadedFiles.value.some(item => item.status === 'loading')
    })

    const lastFileData = computed(() => {
      const lastFile = last(uploadedFiles.value)
      if (lastFile) {
        return {
          loaded: lastFile.status === 'success',
          data: lastFile.resp
        }
      }
      return false
    })

    const triggerUpload = () => {
      if (fileInput.value) fileInput.value.click()
    }

    const removeFile = (id: string) => {
      uploadedFiles.value = uploadedFiles.value.filter(item => item.uid !== id)
    }

    const postFile = (uploadedFile: File) => {
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
          fileObj.resp = resp.data
        }
      }).catch(() => {
        fileObj.status = 'error'
      }).finally(() => {
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      })
    }

    const handleChangeFiles = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile)
          if (result && result instanceof Promise) {
            result.then((file) => {
              if (file instanceof File) postFile(file)
              else throw new Error('beforeUpload Promise should return File object') 
            }).catch(e => {
              console.error(e)
            })
          } else if (result === true) {
            postFile(uploadedFile)
          }
        } else {
          postFile(uploadedFile)
        }
      }
    }


    return () => (
      <div class="file-upload">
        <div onClick={triggerUpload}>
          {
            (() => {
              if (isUploading.value) {
                return slots.loading ? slots.loading() : <button disabled>正在上传</button>
              } else if (lastFileData.value && lastFileData.value.loaded) {
                return slots.uploaded ? slots.uploaded({
                  uploadedData: lastFileData.value.data
                },) : <button>点击上传</button>
              } else {
                return slots.default ? slots.default() : <button>点击上传</button>
              }
            })()
          }
        </div>
        <input ref={fileInput} onChange={(e) => handleChangeFiles(e)} type="file" style={{ display: 'none' }} />
        <ul class="upload-list">
          {
            uploadedFiles.value.map((file) => {
              return (
                <li class={`uploaded-file upload-${file.status}`} key={file.uid}>
                  <span class="file-icon">
                    {
                      file.status === 'loading' ? <LoadingOutlined /> : <FileOutlined />
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