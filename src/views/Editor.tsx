import { defineComponent, computed, h, resolveComponent, ref, CSSProperties, onMounted } from 'vue'
import EditWrapper from '../components/EditWrapper'
import ComponentsList from '../components/ComponentsList';
import defaultTextTemplates from '../defaultTemplates'
import LayerList from '../components/LayerList'
import { useStore } from 'vuex'
import '@/styles/Editor.scss'
import EditGroup from '../components/EditGroup'
import { GlobalDataProps } from '../store/index'
import { ComponentData } from '../store/editor'
import HistoryArea from './editor/HistoryArea';
import { AllComponentProps } from '@/defaultProps';
import PropsTable from '@/components/PropsTable';
import { pickBy } from 'lodash-es';
import initHotKeys from '@/plugins/hotKeys';
import initContextMenu from '@/plugins/initContext';
import { useRoute } from 'vue-router';
import UserProfile from '@/components/UserProfile';
import InlineInput from '@/components/InlineInput';

export type TabType = 'component' | 'layer' | 'page'
export default defineComponent({
  name: 'Editor',
  components: {
    PropsTable,
    EditGroup,
    ComponentsList,
    HistoryArea,
    InlineInput,
    EditWrapper
  },
  setup() {
    initHotKeys()
    initContextMenu()
    const route = useRoute()
    const currentWorkId = route.params.id
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components)
    const page = computed(() => store.state.editor.page)
    const componentList = computed(() => defaultTextTemplates)
    const userInfo = computed(() => store.state.user)
    const activePanel = ref<TabType>('component')
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)
    onMounted(() => {
      if (currentWorkId) {
        store.dispatch('fetchWork', { urlParams: { id: currentWorkId } })
      }
    })
    const addItem = (component: ComponentData) => {
      store.commit('addComponent', component)
    }
    const setActive = (id: string) => {
      store.commit('setActive', id)
    }
    const handleChange = (e: any) => {
      store.commit('updateComponent', e)
    }
    const deleteComponent = () => {
      store.commit('deleteComponent')
    }
    const pageChange = (e: any) => {
      store.commit('updatePage', e)
    }
    const titleChange = (newTitle: string) => {
      store.commit('updatePage', { key: 'title', value: newTitle, isRoot: true })
    }

    const saveWork = () => {
      const { title, props } = page.value
      const payload = {
        title,
        content: {
          props,
          components: components.value
        }
      }
      store.dispatch('saveWork', { data: payload, urlParams: { id: currentWorkId }, successMessage: '保存成功' })
    }

    const updatePosition = (data: { left: number; top: number; id: string }) => {
      const { id } = data
      const updatedData = pickBy<number>(data, (v, k) => k !== 'id')
      const keysArr = Object.keys(updatedData)
      const valuesArr = Object.values(updatedData).map(v => v + 'px')
      store.commit('updateComponent', { key: keysArr, value: valuesArr, id })
    }
    return () => (
      <div class="editor-content">

        <a-layout>
          <a-layout-header class="header">
            <div class="page-title">
              <router-link to="/">
                <div class="page-title">
                  拖拖艺术
                </div>
              </router-link>
              <InlineInput value={page.value.title || ''} onChange={titleChange} >
                {{
                  default: ({ text }: any) => <span>{text}</span>
                }}
              </InlineInput>
            </div>
            <a-menu
              selectable={false}
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
            >
              <a-menu-item key="1">
                <a-button type="primary">预览和设置</a-button>
              </a-menu-item>
              <a-menu-item key="2">
                <a-button type="primary" onClick={saveWork}>保存</a-button>
              </a-menu-item>
              <a-menu-item key="3">
                <a-button type="primary" >发布</a-button>
              </a-menu-item>
              <a-menu-item key="4">
                <UserProfile user={userInfo.value}></UserProfile>
              </a-menu-item>
            </a-menu>

          </a-layout-header>
        </a-layout>

        <a-layout class="content-row">
          <a-layout-sider width="300" style="background: #fff">
            <div class="sidebar-container">
              <div>组件列表 </div>
              <ComponentsList list={componentList.value} onItemCreate={addItem} />
              <img id="test-image" style={{ width: '300px' }} />
            </div>
          </a-layout-sider>

          <a-layout style="padding: 0 24px 24px">
            <a-layout-content class="preview-container">
              <p>画布区域</p>
              <HistoryArea></HistoryArea>
              <div class="preview-list" id="canvas-area">
                <div class="body-container" style={page.value.props as CSSProperties}>
                  {
                    components.value?.map(item => (
                      <EditWrapper
                        key={item.id}
                        id={item.id}
                        hidden={item.isHidden}
                        onSetActive={setActive}
                        onUpdatePosition={updatePosition}
                        props={item.props}
                        active={item.id === (currentElement.value && currentElement.value.id)}
                      >
                        {{
                          default: () => (
                            <>
                              {h(resolveComponent(item.name), { ...item.props })}
                            </>
                          )
                        }}
                      </EditWrapper>))
                  }
                </div>
              </div>
            </a-layout-content>
          </a-layout>
          <a-layout-sider width="300" style="background: #fff" class="settings-panel">
            <a-tabs type="card" activeKey={activePanel.value} onChange={(key: TabType) => activePanel.value = key}>
              <a-tab-pane key="component" tab="属性设置" class="no-top-radius">
                {
                  currentElement?.value ? (
                    <>
                      {
                        !currentElement.value.isLocked ? (
                          <>
                            <edit-group
                              props={currentElement.value.props}
                              onChange={handleChange}
                            />
                            {currentElement.value ? <a-button type="primary" onClick={deleteComponent}>删除组件</a-button> : ''}
                          </>
                        ) : (
                          <div>
                            <div>
                              <a-empty>
                                {
                                  {
                                    description: () => <p>该元素被锁定，无法编辑</p>,
                                    default: () => ''
                                  }
                                }
                              </a-empty>
                            </div>
                          </div>
                        )
                      }
                    </>
                  ) : null
                }
                <pre>
                  {Object.keys(currentElement.value?.props || {}).map((item) => {
                    return (
                      <div>
                        {item}: {currentElement.value?.props[item as keyof AllComponentProps]}
                      </div>
                    )
                  })}
                </pre>

              </a-tab-pane>

              <a-tab-pane key="layer" tab="图层设置">
                <LayerList
                  list={components.value}
                  selectedId={currentElement.value ? currentElement.value?.id : ''}
                  onChange={(e) => handleChange(e)}
                  onSelect={(e) => setActive(e)}
                />
              </a-tab-pane>

              <a-tab-pane key="page" tab="页面设置">
                <props-table props={page.value.props} onChange={pageChange}></props-table>
              </a-tab-pane>
            </a-tabs>
          </a-layout-sider>
        </a-layout>
      </div >
    )
  }
})
