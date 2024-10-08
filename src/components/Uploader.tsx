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
    },
    onProgress: {
      type: Function
    },
    onSuccess: {
      type: Function
    },
    onError: {
      type: Function
    },
    onChange: {
      type: Function
    },
    drag: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    }
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined
  },
  setup(props, { slots }) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const filesList = ref<UploadFile[]>([])
    const isDragOver = ref(false)
    const progressNumber = ref(0)
    const isUploading = computed(() => {
      return filesList.value.some(item => item.status === 'loading')
    })

    const lastFileData = computed(() => {
      const lastFile = last(filesList.value)
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
      filesList.value = filesList.value.filter(item => item.uid !== id)
    }

    const postFile = (readyFile: UploadFile) => {
      const formData = new FormData()
      formData.append(readyFile.name, readyFile.raw)
      readyFile.status = 'loading'

      axios.post(props.action, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          progressNumber.value = Number((progressEvent.loaded / progressEvent.total).toFixed(1))
          if (props.onProgress) {
            props.onProgress(progressEvent)
          }
        }
      },).then(resp => {
        if (resp.data.errorData) {
          readyFile.status = 'error'
          props.onError && props.onError(resp.data.errorData)
        }
        else {
          props.onSuccess && props.onSuccess(resp.data)
          readyFile.status = 'success'
          readyFile.resp = resp.data
        }
      }).catch(() => {
        readyFile.status = 'error'
      }).finally(() => {
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      })
    }

    const uploadFiles = () => {
      filesList.value.filter(file => file.status === 'ready').forEach(readyFile => postFile(readyFile))
    }

    const addFileToList = (uploadedFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: v4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: 'ready',
        raw: uploadedFile
      })
      filesList.value.push(fileObj)
      if (props.autoUpload) {
        postFile(fileObj)
      }
    }

    const beforeUploadCheck = (files: null | FileList) => {
      props.onChange && props.onChange(files)
      if (files) {
        const uploadedFile = files[0]
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile)
          if (result && result instanceof Promise) {
            result.then((file) => {
              if (file instanceof File) addFileToList(file)
              else throw new Error('beforeUpload Promise should return File object')
            }).catch(e => {
              console.error(e)
            })
          } else if (result === true) {
            addFileToList(uploadedFile)
          }
        } else {
          addFileToList(uploadedFile)
        }
      }
    }

    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault()
      isDragOver.value = over
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      isDragOver.value = false
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files)
      }
    }

    const handleChangeFiles = (e: Event) => {
      const target = e.target as HTMLInputElement
      beforeUploadCheck(target.files)
    }

    const getUploaderButton = () => {
      if (isUploading.value) {
        return slots.loading ? slots.loading({
          loadedPresent: progressNumber.value
        }) : <button disabled>正在上传</button>
      } else if (lastFileData.value && lastFileData.value.loaded) {
        return slots.uploaded ? slots.uploaded({
          uploadedData: lastFileData.value.data
        },) : <button>点击上传</button>
      } else {
        return slots.default ? slots.default() : <button>点击上传</button>
      }
    }

    let events: { [key: string]: (e: any) => void } = {
      'onClick': triggerUpload
    }
    if (props.drag) {
      events = {
        ...events,
        'onDragover': (e: DragEvent) => { handleDrag(e, true) },
        'onDragleave': (e: DragEvent) => { handleDrag(e, false) },
        'onDrop': handleDrop
      }
    }

    return () => (
      <div class="file-upload">
        <div onClick={triggerUpload} class={{ "upload-area": true, "is-dragover": props.drag && isDragOver.value }} {...events}>
          {
            getUploaderButton()
          }
        </div>
        <input ref={fileInput} onChange={(e) => handleChangeFiles(e)} type="file" style={{ display: 'none' }} />
        <ul class="upload-list">
          {
            filesList.value.map((file) => {
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