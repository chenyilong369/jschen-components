import store, { actionWrapper, GlobalDataProps } from ".";
import { AllComponentProps, textDefaultProps } from '../defaultProps'
import { Module, Mutation } from "vuex";
import { v4 } from 'uuid'
import { message } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import { insertAt } from "@/utils/helper";
import { RespWorkData, RespListData, RespData } from "./respTypes";
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
  cachedOldValues: any;
  maxHistoryNumber: number;
  isDirty: boolean; // 数据是否有修改
  channels: ChannelProps[];
}

export interface UpdateComponentData {
  key: keyof AllComponentProps;
  value: string;
  id: string;
  isRoot?: boolean;
}

export interface ChannelProps {
  id: string;
  name: string;
  workId: number;
  status: number;
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
  { id: v4(), name: 'l-text', layerName: '图层1', props: { ...textDefaultProps, text: 'hello', fontSize: '20px', color: '#000000', 'lineHeight': '1', textAlign: 'left', fontFamily: '', width: '100px', height: '100px', backgroundColor: '#efefef', left: '100px', top: '150px' } },
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
  user?: {
    gender: string;
    nickName: string;
    picture: string;
    userName: string;
  };
}

const pageDefaultProps = { backgroundColor: '#ffffff', backgroundImage: '', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '600px' }

const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  if (state.historyIndex !== -1) {
    state.histories = state.histories.slice(0, state.historyIndex)
    state.historyIndex = -1
  }
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord)
  } else {
    state.histories.shift()
    state.histories.push(historyRecord)
  }
}

const modifyHistory = (state: EditorProps, history: HistoryProps, type: 'undo' | 'redo') => {
  const { componentId, data } = history
  const { key, oldValue, newValue } = data
  const newKey = key as keyof AllComponentProps | Array<keyof AllComponentProps>
  const updatedComponent = state.components.find((component) => component.id === componentId)
  if (updatedComponent) {
    if (Array.isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        updatedComponent.props[keyName] = type === 'undo' ? oldValue[index] : newValue[index]
      })
    } else {
      updatedComponent.props[newKey] = type === 'undo' ? oldValue : newValue
    }
  }
}

const debounceChange = (callabck: (...args: any) => void, timeout = 1000) => {
  let timer: any = 0
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      console.log(timer)
      callabck(...args)
      timer = 0
    }, timeout)
  }
}

const pushModifyHistory = (state: EditorProps, { key, value, id }: UpdateComponentData) => {
  pushHistory(state, {
    id: v4(),
    componentId: (id || state.currentElement),
    type: 'modify',
    data: { oldValue: state.cachedOldValues, newValue: value, key }
  })
  state.cachedOldValues = null
}

const pushHistoryDebounce = debounceChange(pushModifyHistory)

const setDirtyWrapper = (callback: Mutation<EditorProps>) => {
  return (state: EditorProps, payload: any) => {
    state.isDirty = true
    callback(state, payload)
  }
}

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: '',
    page: {
      props: pageDefaultProps,
      title: 'test title'
    },
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 5,
    isDirty: false,
    channels: []
  },
  mutations: {
    // 重置画布
    resetEditor(state) {
      state.components = []
      state.currentElement = ''
      state.historyIndex = -1
      state.histories = []
    },
    // 新增元素调用
    addComponent: setDirtyWrapper((state, component: ComponentData) => {
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      pushHistory(state, {
        id: v4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component)
      })
    }),
    // 删除元素调用
    deleteComponent: setDirtyWrapper((state, id) => {
      const currentElement = store.getters.getElement(id)
      if (currentElement) {
        const currentIndex = state.components.findIndex(component => component.id === id)
        state.components = state.components.filter(component => component.id !== id)
        pushHistory(state, {
          id: v4(),
          componentId: currentElement.id,
          type: 'delete',
          data: currentElement,
          index: currentIndex
        })
        message.success('删除当前图层成功', 1)
      }
    }),
    setActive(state, currentId: string) {
      state.currentElement = currentId
    },
    // 更新元素调用
    updateComponent: setDirtyWrapper((state, { key, value, id, isRoot }: UpdateComponentData) => {
      const updateComponent = state.components.find((item) => item.id === (id || state.currentElement))
      if (updateComponent) {
        if (isRoot) {
          (updateComponent as any)[key] = value;
        } else {
          const oldValue = Array.isArray(key) ? key.map((key: keyof AllComponentProps) => updateComponent.props[key]) : updateComponent.props[key]
          if (!state.cachedOldValues) {
            state.cachedOldValues = oldValue
          }
          pushHistoryDebounce(state, { key, value, id }, oldValue)
          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName: keyof AllComponentProps, index) => {
              updateComponent.props[keyName] = value[index]
            })
          } else if (typeof key === 'string' && typeof value === 'string') {
            updateComponent.props[key] = value
          }

        }

      }
    }),
    // 测销操作
    undo: (state) => {
      if (state.historyIndex === -1) {
        state.historyIndex = state.histories.length - 1
      } else {
        state.historyIndex--
      }
      const history = state.histories[state.historyIndex]
      switch (history.type) {
        case "add":
          state.components = state.components.filter(component => component.id !== history.componentId)
          break
        case "delete":
          state.components = insertAt(state.components, history.index as number, history.data)
          break
        case "modify": {
          modifyHistory(state, history, 'undo')
          break
        }
        default:
          break
      }
    },

    // 恢复操作
    redo: (state) => {
      if (state.historyIndex === -1) return;

      const history = state.histories[state.historyIndex]
      switch (history.type) {
        case "add":
          state.components.push(history.data)
          break;
        case "delete":
          state.components = state.components.filter(component => component.id !== history.componentId)
          break
        case "modify":
          modifyHistory(state, history, 'redo')
          break
        default:
          break
      }
      state.historyIndex++
    },

    // 更新页面设置
    updatePage: setDirtyWrapper((state, { key, value, isRoot, isSetting }) => {
      if (isRoot) {
        state.page[key as keyof PageData] = value
      } else if (isSetting) {
        state.page.setting = {
          ...state.page.setting,
          [key]: value
        }
      } else {
        if (state.page.props) {
          state.page.props[key as keyof PageProps] = value
        }
      }
    }),

    // 快捷键移动元素调用
    moveComponent: (state, data: { direction: MoveDirection; amount: number; id: string }) => {
      const currentComponent = store.getters.getElement(data.id) as ComponentData
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0')
        const oldLeft = parseInt(currentComponent.props.left || '0')
        const { direction, amount } = data
        switch (direction) {
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

    // 复制元素调用
    copyComponent: (state, id) => {
      const currentElement = store.getters.getElement(id)
      if (currentElement) {
        state.copiedComponent = currentElement
        message.success('已拷贝当前图层', 1)
      }
    },
    // 粘贴元素调用
    pasteCopiedComponent: setDirtyWrapper((state) => {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent)
        clone.id = v4()
        clone.layerName = clone.layerName + '副本'
        state.components.push(clone)
        message.success('已黏贴当前图层', 1)

        pushHistory(state, {
          id: v4(),
          componentId: clone.id,
          type: 'add',
          data: cloneDeep(clone)
        })
      }
    }),
    // 依据接口初始化画布
    fetchWork(state, { data }: RespWorkData) {
      const { content, ...rest } = data
      state.page = { ...state.page, ...rest }
      if (content.props) {
        state.page.props = content.props
      }
      if (content.setting) {
        state.page.setting = content.setting
      }
      state.components = content.components
    },
    saveWork: (state) => {
      state.isDirty = false
    },
    fetchChannels: (state, { data }: RespListData<ChannelProps>) => {
      state.channels = data.list
    },
    createChannel: (state, { data }: RespData<ChannelProps>) => {
      state.channels = [...state.channels, data]
    },
    deleteChannel: (state, {payload}: RespData<any>) => {
      if (payload && payload.urlParams) {
        const { urlParams } = payload
        state.channels = state.channels.filter(channel => channel.id !== urlParams.id)
      }
    }
  },
  actions: {
    fetchWork: actionWrapper('/works/:id', 'fetchWork'),
    saveWork: actionWrapper('/works/:id', 'saveWork', { method: 'patch' }),
    publishWork: actionWrapper('/works/publish/:id', 'publishWork', { method: 'post' }),
    fetchChannels: actionWrapper('/channel/getWorkChannels/:id', 'fetchChannels'),
    createChannel: actionWrapper('/channel/', 'createChannel', { method: 'post' }),
    deleteChannel: actionWrapper('/channel/:id', 'deleteChannel', { method: 'delete' })
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((item) => item.id === state.currentElement)
    },
    getElement: (state) => (id: string) => {
      return state.components.find((component) => component.id === (id || state.currentElement))
    },
    checkUndoDisable: (state) => {
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true
      }
      return false
    },
    checkRedoDisable: (state) => {
      if (state.histories.length === 0 ||
        state.historyIndex === state.histories.length ||
        state.historyIndex === -1) {
        return true
      }
      return false
    }
  }
}

export default editor
