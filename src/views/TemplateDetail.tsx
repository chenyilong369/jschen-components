import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GlobalDataProps } from '../store/index'
import '@/styles/TemplateDetail.scss'
import { TemplateProps } from '../store/templates'
export default defineComponent({
  name: 'TemplateDetail',
  setup() {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentId = route.params.id as string
    const template = computed<TemplateProps>(() => store.getters.getTemplateById(parseInt(currentId)))
    return () => {
      return (
        <div class="work-detail-container">
          {
            template.value ? (
              <a-row type="flex" justify="center">
                <a-col span="8" class="cover-img">
                  <a href={template.value.coverImg}>
                    <img src={template.value.coverImg} alt="" id="cover-img" />
                  </a>
                </a-col>
                <a-col span="8">
                  <h2>{template.value.title}</h2>
                  <div class="author">
                    <a-avatar>V</a-avatar>
                    该模版由 <b>{template.value.author}</b> 创作
                  </div>
                  <div class="bar-code-area">
                    <span>扫一扫，手机预览</span>
                    <canvas id="barcode-container"></canvas>
                  </div>
                  <div class="use-button">
                    <router-link to="/editor">
                      <a-button type="primary" size="large">
                        使用模版
                      </a-button>
                    </router-link>
                    <a-button size="large">
                      下载图片海报
                    </a-button>
                  </div>
                </a-col>
              </a-row>
            ) : null
          }
        </div>
      )
    }
  }
})