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

    const drawCanvas = () => {
      // 获取节点
      const canvas = document.getElementById('canvas-image') as HTMLCanvasElement
      canvas.width = 400
      canvas.height = 400
      const element = document.getElementById('author') as HTMLElement
      // 创建 svg
      const data = `
        <svg xmlns='http://www.w3.org/2000/svg' width='400px' height='400px'>
          <foreignObject width='100%' height='100%'>
            <div xmlns='http://www.w3.org/1999/xhtml'>
              ${element.innerHTML}
            </div>
          </foreignObject>
        </svg>
      `
      const svg = new Blob([data], { type: 'image/svg+xml; charset=utf-8' })
      // 创建图片
      const url = URL.createObjectURL(svg)
      const image = new Image()
      image.src = url
      image.addEventListener('load', () => {
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(image, 0, 0)
      })
    }

    return () => {
      return (
        <div class="work-detail-container">
          {
            template.value ? (
              <a-row type="flex" justify="center">
                <canvas id="canvas-image"></canvas>
                <a-col span="8" class="cover-img">
                  <a href={template.value.coverImg}>
                    <img src={template.value.coverImg} alt="" id="cover-img" />
                  </a>
                </a-col>
                <a-col span="8">
                  <h2>{template.value.title}</h2>
                  <div class="author" id='author'>
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
                    <a-button size="large" onClick={drawCanvas}>
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