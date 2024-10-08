import { defineComponent, computed, h, resolveComponent } from 'vue'
import EditWrapper from '../components/EditWrapper.tsx'
import ComponentsList from '../components/ComponentsList.tsx';
import defaultTextTemplates from '../defaultTemplates'
import { useStore } from 'vuex'
import '@/styles/Editor.scss'
import LText from '../components/LText.tsx'
import { GlobalDataProps } from '../store/index'
import { ComponentData } from '../store/editor'
import PropsTable from '@/components/PropsTable.tsx';
export default defineComponent({
  name: 'Editor',
  components: {
    LText,
    PropsTable,
    ComponentsList,
    EditWrapper
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components)
    const componentList = computed(() => defaultTextTemplates)
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)
    const addItem = (props: any) => {
      store.commit('addComponent', props)
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
      <div class="edtior-content">
        <a-row class="content-row">
          <a-col flex="1" class="left">
            <div>组件列表 </div>
            <ComponentsList list={componentList.value} onItemClick={addItem} />
          </a-col>
          <a-col flex="2" class="middle">
            <div class="middle-title">
              画布区域
            </div>
            <div class="draw">
              {
                components.value?.map(item => (
                  <EditWrapper
                    key={item.id} 
                    id={item.id} 
                    onSetActive={setActive}
                    active={item.id === (currentElement.value && currentElement.value.id)}
                  >
                    {{ default: () => (
                      <>
                        {h(resolveComponent(item.name), {...item.props})}
                      </>
                    )}}
                  </EditWrapper>))
              }
            </div>
          </a-col>
          <a-col flex="1" class="right">
            {
              currentElement.value?.props ? <PropsTable props={currentElement.value.props} onChange={handleChange} /> : ''
            }
            {  currentElement.value ? <a-button type="primary" onClick={deleteComponent}>删除组件</a-button> : ''}
            <pre>
              { Object.keys(currentElement.value?.props || {}).map(item => {
                return (
                  <div>
                    {item}: {currentElement.value?.props[item]}
                  </div>
                )
              }) }
            </pre>
          </a-col>
        </a-row>
      </div>
    )
  }
})
