import store, { GlobalDataProps } from ".";
import { AllComponentProps, imageDefaultProps, textDefaultProps } from '../defaultProps'
import { Module } from "vuex";
import { v4 } from 'uuid'
import { message } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'
export type HistoryType = 'add' | 'delete' | 'modify'

export interface HistoryProps {
  id: string;
  componentId: string;
  type: HistoryType;
  data: any;
  index?: number; // 保存删除时原图层在数组中的位置
}

export interface EditorProps {
  components: ComponentData[];
  currentElement: string; // 当前选中组件id
  page: PageData;
  copiedComponent?: ComponentData;
  histories: HistoryProps[];
  historyIndex: number; // 记录目前走到哪个历史记录
}

export interface UpdateComponentData {
  key: keyof AllComponentProps;
  value: string;
  id: string;
  isRoot?: boolean;
}

export interface ComponentData {
  layerName?: string;
  isLocked?: boolean; // 图层是否锁定
  isHidden?: boolean; // 图层是否隐藏
  props: Partial<AllComponentProps>;
  id: string;
  name: string;
}

export const testComponents: ComponentData[] = [
  { id: v4(), name: 'l-text', layerName:'图层1', props: { ...textDefaultProps, text: 'hello', fontSize: '20px', color: '#000000', 'lineHeight': '1', textAlign: 'left', fontFamily: '', width: '100px', height: '100px', backgroundColor: '#efefef', left: '100px', top: '150px' }},
  // { id: v4(), name: 'l-text', layerName:'图层2', props: { ...textDefaultProps, text: 'hello2', fontSize: '10px', fontWeight: 'bold', 'lineHeight': '2', textAlign: 'left', fontFamily: '' }},
  // { id: v4(), name: 'l-text', layerName:'图层3', props: { ...textDefaultProps, text: 'hello3', fontSize: '15px', actionType: 'url', url: 'https://www.baidu.com', 'lineHeight': '3', textAlign: 'left', fontFamily: '' }},
  // { id: v4(), name: 'l-image', layerName:'图层4', props: { ...imageDefaultProps, src: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f3e3a17c305b1070f455202.jpg', width: '100px' }},
]

export interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}
export type AllFormProps = PageProps & AllComponentProps

export interface PageData {
  id?: number;
  props?: PageProps;
  title?: string;
  desc?: string;
  coverImg?: string;
  uuid?: string;
  setting?: { [key: string]: any };
  isTemplate?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  author?: string;
  copiedCount?: number;
  status?: number;
  user? : {
    gender: string;
    nickName: string;
    picture: string;
    userName: string;
  };
}

const pageDefaultProps = { backgroundColor: '#ffffff', backgroundImage: '', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '600px' }

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      props: pageDefaultProps,
      title: 'test title'
    },
    histories: [],
    historyIndex: -1
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      state.histories.push({
        id: v4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component)
      })
    },
    deleteComponent(state, id) {
      const currentElement = store.getters.getElement(id)
      if (currentElement) {
        const currentIndex = state.components.findIndex(component => component.id === id)
        state.components = state.components.filter(component => component.id !== id)
        state.histories.push({
          id: v4(),
          componentId: currentElement.id,
          type: 'delete',
          data: currentElement, // 不会修改，直接保存
          index: currentIndex
        })
        message.success('删除当前图层成功', 1)
      }
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    updateComponent(state, { key, value, id, isRoot }: UpdateComponentData) {
      const updateComponent = state.components.find((item) => item.id === (id || state.currentElement))
      if (updateComponent) {
        if (isRoot) {
          (updateComponent as any)[key] = value;
        } else {
          const oldValue = Array.isArray(key) ? key.map((key: keyof AllComponentProps) => updateComponent.props[key]) : updateComponent.props[key]
          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName: keyof AllComponentProps, index) => {
              updateComponent.props[keyName] = value[index]
            })
          } else if (typeof key ==='string' && typeof value === 'string') {
            updateComponent.props[key] = value.toString()
          }
          state.histories.push({
            id: v4(),
            componentId: (id || state.currentElement),
            data: {
              oldValue,
              newValue: value,
              key
            },
            type: 'modify'
          })
        }

      }
    },
    updatePage: (state, { key, value, isRoot, isSetting }) => {
      if (isRoot) {
        state.page[key as keyof PageData] = value
      } else if (isSetting) {
        debugger
        state.page.setting = {
          ...state.page.setting,
          [key]: value
        }
      } else {
        if (state.page.props) {
          state.page.props[key as keyof PageProps] = value
        }
      }
    },
    moveComponent: (state, data: { direction: MoveDirection; amount: number; id: string }) => {
      const currentComponent = store.getters.getElement(data.id) as ComponentData
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0')
        const oldLeft = parseInt(currentComponent.props.left || '0')
        const {direction, amount} = data
        switch(direction) {
          case 'Up': {
            const newValue = oldTop - amount + 'px'
            store.commit('updateComponent', { key: 'top', value: newValue, id: data.id })
            break
          }
          case 'Down': {
            const newValue = oldTop + amount + 'px'
            store.commit('updateComponent', { key: 'top', value: newValue, id: data.id })
            break
          }
          case 'Left': {
            const newValue = oldLeft - amount + 'px'
            store.commit('updateComponent', { key: 'left', value: newValue, id: data.id })
            break
          }
          case 'Right': {
            const newValue = oldLeft + amount + 'px'
            store.commit('updateComponent', { key: 'left', value: newValue, id: data.id })
            break
          }
          default:
            break
        }
      }
    },
    copyComponent: (state, id) => {
      const currentElement = store.getters.getElement(id)
      if (currentElement) {
        state.copiedComponent = currentElement
        message.success('已拷贝当前图层', 1)
      }
    },
    pasteCopiedComponent: (state) => {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent)
        clone.id = v4()
        clone.layerName = clone.layerName + '副本'
        state.components.push(clone)
        message.success('已黏贴当前图层', 1)

        state.histories.push({
          id: v4(),
          componentId: clone.id,
          type: 'add',
          data: cloneDeep(clone)
        })
      }
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((item) => item.id === state.currentElement)
    },
    getElement: (state) => (id: string) => {
      return state.components.find((component) => component.id === (id || state.currentElement))
    },
  }
}

export default editor
