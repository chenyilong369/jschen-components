import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import '@/styles/Home.scss'
import { GlobalDataProps } from '../store/index'
import TemplateList from '../components/TemplateList'
import Uploader from '@/components/Uploader'
export default defineComponent({
  components: {
    TemplateList,
    Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const testData = computed(() => store.state.templates.data)
    return () => (
      <div class="content-container">
        <Uploader action="http://127.0.0.1:7001/cos" drag>
          {{
            default: () => (<div class="uploader-container"><h4>上传图片</h4></div>),
            loading: () => (<div class="uploader-container"><h4>上传中</h4></div>),
            uploaded: ({ uploadedData }: any) => {
              console.log(uploadedData, 123123)
              return (
                <div class="uploaded-area">
                  <img src={'https://' + uploadedData.successData.Location} />
                  <h3>点击重新上传</h3>
                </div>
              )
            }
          }}
        </Uploader>
        <template-list list={testData.value}></template-list>
      </div>
    )
  }
})