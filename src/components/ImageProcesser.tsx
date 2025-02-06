import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import Cropper from 'cropperjs'
import { DeleteOutlined, ScissorOutlined } from '@ant-design/icons-vue'
import StyledUploader from './StyledUploader'
import { RespUploadData } from '@/store/respTypes'
import '@/styles/components/ImageProcesser.scss'
interface CropDataProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    },
    ratio: {
      type: Number
    },
    showDelete: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DeleteOutlined,
    StyledUploader,
    ScissorOutlined
  },
  emits: ['change', 'uploaded'],
  setup(props, context) {
    const showModal = ref(false)
    const backgrondUrl = computed(() => `url(${props.value})`)
    const baseImageUrl = computed(() => props.value.split('?')[0])
    const cropperImg = ref<null | HTMLImageElement>(null)
    let cropper: Cropper
    let cropData: CropDataProps | null = null
    watch(showModal, async (newValue) => {
      if (newValue) {
        await nextTick()
        console.log(cropperImg.value)
        if (cropperImg.value) {
          cropper = new Cropper(cropperImg.value, {
            crop(event) {
              const { x, y, width, height } = event.detail
              cropData = {
                x: Math.floor(x),
                y: Math.floor(y),
                width: Math.floor(width),
                height: Math.floor(height)

              }
            }
          })
        }
      } else {
        if (cropper) {
          cropper.destroy()
        }
      }
    })
    const handleOk = () => {
      if (cropData) {
        const { x, y, width, height } = cropData
        const cropperURL = baseImageUrl.value + `?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
        // 不使用 阿里云 OSS，拿到截图图片再次上传的处理方法
        // 这里实现还是采用原方法，假如同学们愿意使用重新上传的方法的话，请看下面注释的代码
        // cropper.getCroppedCanvas().toBlob((blob) => {
        //   if (blob) {
        //     const formData = new FormData()
        //     formData.append('croppedImage', blob, 'test.png')
        //     axios.post('http://local.test:7001/api/upload/', formData, {
        //       headers: {
        //         'Content-Type': 'multipart/form-data'
        //       }
        //     }).then(resp => {
        //       context.emit('change', resp.data.data.url)
        //       showModal.value = false
        //     })
        //   }
        // })
        context.emit('change', cropperURL)
      }
      showModal.value = false
    }
    const handleFileUploaded = (data: { resp: RespUploadData; file: File }) => {
      const { resp } = data
      message.success('上传成功')
      context.emit('change', resp.data.url)
      context.emit('uploaded', data)
    }
    const handleDelete = () => {
      context.emit('change', '')
    }
    return {
      handleFileUploaded,
      handleDelete,
      backgrondUrl,
      showModal,
      cropperImg,
      handleOk,
      baseImageUrl
    }
  },
  render() {
    return (
      <>
        <div class="image-processer">
          <a-modal
            title="裁剪图片"
            open={this.showModal}
            onOk={this.handleOk}
            onCancel={() => { this.showModal = false }}
            okText="确认"
            cancelText="取消"
          >
            <div class="image-cropper">
              <img src={this.baseImageUrl} id="processed-image" ref="cropperImg" />
            </div>
          </a-modal>
          <div
            style={{ backgroundImage: this.backgrondUrl }}
            class={this.$props.showDelete ? 'image-preview extraHeight' : 'image-preview'}
          >
          </div>
          <div class="image-process">
            <styled-uploader onSuccess={this.handleFileUploaded}></styled-uploader>
            <a-button onClick={() => { this.showModal = true }}>
              {{
                icon: () => <ScissorOutlined />,
                default: () => '裁剪图片'
              }}
            </a-button>
            { // 是否展示删除按钮
              this.$props.showDelete ?
                (
                  <a-button type="danger" onClick={this.handleDelete}>
                    {{
                      icon: () => <DeleteOutlined />,
                      default: () => '删除图片'
                    }}
                  </a-button>
                ) : null
            }
          </div>
        </div>
      </>
    )
  }
})