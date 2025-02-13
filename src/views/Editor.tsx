import { defineComponent, computed, h, resolveComponent, ref } from 'vue'
import EditWrapper from '../components/EditWrapper'
import ComponentsList from '../components/ComponentsList';
import defaultTextTemplates from '../defaultTemplates'
import LayerList from '../components/LayerList'
import { useStore } from 'vuex'
import '@/styles/Editor.scss'
import LText from '../components/LText'
import LImage from '@/components/LImage';
import { GlobalDataProps } from '../store/index'
import { ComponentData } from '../store/editor'
import { AllComponentProps } from '@/defaultProps';
import PropsTable from '@/components/PropsTable';

export type TabType = 'component' | 'layer' | 'page'
export default defineComponent({
  name: 'Editor',
  components: {
    LText,
    PropsTable,
    LImage,
    ComponentsList,
    EditWrapper
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components)
    const componentList = computed(() => defaultTextTemplates)
    const activePanel = ref<TabType>('component')
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)
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
    return () => (
      <div class="editor-content">
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
              <div class="preview-list" id="canvas-area">
                <div class="body-container">
                  {
                    components.value?.map(item => (
                      <EditWrapper
                        key={item.id}
                        id={item.id}
                        hidden={item.isHidden}
                        onSetActive={setActive}
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
                            {
                              currentElement.value?.props ? <PropsTable props={currentElement.value.props} onChange={handleChange} /> : ''
                            }
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
            </a-tabs>
          </a-layout-sider>
        </a-layout>
      </div >
    )
  }
})
