import { defineComponent, PropType, computed, ref, watch } from 'vue'
import { EditOutlined, EllipsisOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { TemplateProps } from '../store/templates'
import { Modal } from 'ant-design-vue'
import '@/styles/components/WorksList.scss'
export default defineComponent({
  name: 'works-list',
  emits: ['copy', 'delete'],
  components: {
    EditOutlined,
    EllipsisOutlined,
    CopyOutlined,
    DeleteOutlined,
    DownloadOutlined
  },
  props: {
    list: {
      type: Array as PropType<TemplateProps[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    transferStatus: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {


    const deleteClicked = (id: number) => {
      Modal.confirm({
        title: '确定要删除该作品吗？',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          context.emit('delete', id)
        }
      })
    }
    const copyClicked = (id: number) => {
      context.emit('copy', id)
    }

    return {
      deleteClicked,
      copyClicked,
    }
  },
  render() {
    return (
      <div class="works-list-component">
        {
          this.loading ? <a-skeleton /> : (
            <a-row gutter={16}>
              {
                this.list.map(item => (
                  <a-col span={6} key={item.id} class="poster-item">
                    <a-card hoverable >
                      {{
                        cover: () => (
                          <>
                            <div>
                              <router-link to={`/editor/${item.id}`}>{
                                item.coverImg ? <img src={item.coverImg} /> : <img src="http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png" />
                              }</router-link>
                            </div>

                            {/* <div class="hover-item">
                              <router-link to={`/editor/${item.id}`}><a-button size="large" type="primary">继续编辑该作品</a-button></router-link>
                            </div> */}
                          </>
                        ),
                        actions: () => (
                          <div>
                            <router-link to={`/editor/${item.id}`}><EditOutlined key="edit" /></router-link>
                            <a-dropdown >
                              {{
                                overlay: () => (
                                  <a-menu class="overlay-dropdown">
                                    <a-menu-item>
                                      <a href="javascript:;" onClick={() => this.copyClicked(item.id)}><CopyOutlined /> 复制</a>
                                    </a-menu-item>
                                    <a-menu-item>
                                      <a href="javascript:;" onClick={() => this.deleteClicked(item.id)}><DeleteOutlined /> 删除</a>
                                    </a-menu-item>
                                    {
                                      item.coverImg ? (
                                        <a-menu-item>
                                          <a href="javascript:;"><DownloadOutlined /> 下载图片</a>
                                        </a-menu-item>
                                      ) : null
                                    }

                                  </a-menu>
                                ),
                                default: () => <EllipsisOutlined key="ellipsis" />
                              }}
                            </a-dropdown>
                          </div>
                        ),
                        default: () => (
                          <a-card-meta title={item.title}>
                          </a-card-meta>
                        )
                      }}

                    </a-card>
                    <div class="tag-list">
                      {
                        item.status === 1 ? (
                          <a-tag color="red" v-if="item.status === 1">
                            未发布
                          </a-tag>
                        ) : null
                      }

                      {
                        item.status === 2 ? (
                          <a-tag color="green">
                            已发布
                          </a-tag>
                        ) : null
                      }
                    </div>
                  </a-col>
                ))
              }

            </a-row>
          )
        }


      </div>
    )
  }
})