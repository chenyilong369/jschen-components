import { GlobalDataProps } from ".";
import { AllComponentProps, imageDefaultProps, textDefaultProps } from '../defaultProps'
import { Module } from "vuex";
import { v4 } from 'uuid'

export interface EditorProps {
  components: ComponentData[];
  currentElement: string; // 当前选中组件id
  page: PageData;
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
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      state.components.push(component)
    },
    deleteComponent(state) {
      state.components = state.components.filter(component => component.id !== state.currentElement)
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
          updateComponent.props[key] = value.toString()
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
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((item) => item.id === state.currentElement)
    }
  }
}

export default editor
