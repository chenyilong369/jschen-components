import { defineComponent, computed, reactive, watch, onMounted } from 'vue'
import { Form } from 'ant-design-vue'
import { GlobalDataProps } from '@/store/index'
import { baseH5URL } from '@/main'
import { useStore } from 'vuex'
import { forEach } from 'lodash-es'
import useSaveWork from '@/hooks/useSaveWork'
import { generateQRCode, timeout } from '@/utils/helper'
import StyledUploader from '@/components/StyledUploader.vue'
import { RespUploadData } from '@/store/respTypes'
const { useForm } = Form
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      defaults: false
    }
  },
  components: {
    StyledUploader
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const store = useStore<GlobalDataProps>()
    const pageState = computed(() => store.state.editor.page)
    const previewURL = computed(() => `${baseH5URL}/p/preview/${pageState.value.id}-${pageState.value.uuid}`)
    const { title, desc, setting } = pageState.value
    const { saveWork, saveIsLoading } = useSaveWork(true)
    const form = reactive({
      title: title || '',
      desc: desc || '',
      uploaded: { data: { url: (setting && setting.shareImg) || 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png' } }
    })
    const rules = reactive({
      title: [
        { required: true, message: '标题不能为空', trigger: 'blur' }
      ],
      desc: [
        { required: true, message: '描述不能为空', trigger: 'blur' }
      ]
    })

    onMounted(async () => {
      try {
        await timeout(100)
        await generateQRCode('preview-barcode-container', previewURL.value)
      } catch (e) {
        console.error(e)
      }
    })
    const updateAvatar = (rawData: { resp: RespUploadData; file: File }) => {
      const url = rawData.resp.data.url
      form.uploaded = {
        data: { url }
      }
    }
    const { validate } = useForm(form, rules)
    const validateAndSave = async () => {
      await validate()
      forEach(form, (value, key) => {
        if (key === 'uploaded' && typeof value !== 'string') {
          store.commit('updatePage', { key: 'shareImg', value: value.data.url, isSetting: true })
        } else {
          store.commit('updatePage', { key, value, isRoot: true })
        }
      })
      await saveWork()
      emit('update:visible', false)
    }
    const onCancel = () => {
      emit('update:visible', false)
    }
    return {
      pageState,
      previewURL,
      form,
      rules,
      saveIsLoading,
      validateAndSave,
      onCancel,
      updateAvatar
    }
  },
  render() {
    return (
      <>
        {
          this.visible ? (
            <div class="preview-form">
              <div class="final-preview">
                <div class="final-preview-inner">
                  <div class="preview-title">
                    {this.pageState.title}
                  </div>
                  <div class="iframe-container">
                    <iframe src={this.previewURL} width="375" frameborder="0" class="iframe-placeholder"
                      height={(this.pageState.props && this.pageState.props.height) ? this.pageState.props.height : '560'}></iframe>
                  </div>
                </div>
              </div>
              <a-drawer
                title="设置面板"
                placement="right"
                width="400"
                closable={true}
                open={this.visible}
                onClose={() => this.onCancel()}
              >
                <div class="publish-form-container">
                  <a-row type="flex" align="middle" style={{ marginBottom: '20px' }}>
                    <a-col span={6}>
                      扫码预览：
                    </a-col>
                    <a-col span={10}>
                      <canvas id="preview-barcode-container"></canvas>
                    </a-col>
                  </a-row>
                  <a-row type="flex" align="middle" style={{ marginBottom: '20px' }}>
                    <a-col span={6}>
                      上传封面：
                    </a-col>
                    <a-col span={10}>
                      <styled-uploader
                        text="上传封面"
                        uploaded={this.form.uploaded}
                        onSuccess={this.updateAvatar}
                        showUploaded
                      >
                      </styled-uploader>
                    </a-col>
                  </a-row>
                  <a-form
                    label-col={{ span: 6 }} wrapper-col={{ span: 16 }}
                    model={this.form} rules={this.rules}
                  >
                    <a-form-item label="标题" required name="title">
                      <a-input value={this.form.title} onChange={(e: { target: { value: string } }) => this.form.title = e.target.value} />
                    </a-form-item>
                    <a-form-item label="描述" required name="desc">
                      <a-input value={this.form.desc} onChange={(e: { target: { value: string } }) => this.form.desc = e.target.value} />
                    </a-form-item>
                    <a-form-item wrapper-col={{ span: 18, offset: 4 }}>
                      <a-button type="primary" style="margin-left: 10px;" onClick={this.validateAndSave} loading={this.saveIsLoading}>
                        保存
                      </a-button>
                      <a-button style="margin-left: 10px;" onClick={this.onCancel}>
                        取消
                      </a-button>
                    </a-form-item>
                  </a-form>
                </div>
              </a-drawer>
            </div>
          ) : null
        }
      </>

    )
  }
})