import { defineComponent, PropType } from 'vue'
import { TemplateProps } from '../store/templates'
import '@/styles/components/TemplateList.scss'
export default defineComponent({
  name: 'template-list',
  props: {
    list: {
      type: Array as PropType<TemplateProps[]>,
      required: true
    }
  },
  setup(props) {
    return () => (
      <div class="template-list-component">
        <a-row gutter="16">
          {
            props.list && props.list.map(item => (
              <a-col span="6" key={item.id} class="poster-item">
                <router-link to={{ name: 'template', params: { id: item.id } }}>
                  <a-card hoverable v-slots={{
                    cover: () => (
                      <>
                        {
                          item.coverImg ? <img src={item.coverImg} v-if="item.coverImg" /> : (
                            <img src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png" />
                          )
                        }
                        <div class="hover-item">
                          <a-button size="large" type="primary">使用该模版创建</a-button>
                        </div>
                      </>
                    )
                  }}>
                    <a-card-meta title={item.title}>
                      {{
                        description: () => (
                          <div class="description-detail">
                            <span>作者：{item.author}</span>
                            <span class="user-number">{item.copiedCount}</span>
                          </div>
                        )
                      }}
                    </a-card-meta>
                  </a-card>
                  <div class="tag-list">
                    {
                      item.isHot ?
                        (<a-tag color="red" v-if="">
                          HOT
                        </a-tag>) : ''
                    }
                    {
                      item.isNew ?
                        (<a-tag color="green" v-if="">
                          NEW
                        </a-tag>) : ''
                    }
                  </div>
                </router-link>
              </a-col>
            ))
          }

        </a-row>
      </div>
    )
  }
})
