import { GlobalDataProps } from ".";
import { AllComponentProps } from '../defaultProps'
import { Module } from "vuex";
import { v4 } from 'uuid'

export interface EditorProps {
  components: ComponentData[];
  currentElement: string; // 当前选中组件id
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

export const testComponents = [
  { id: v4(), name: 'l-text', props: { text: 'hello1', width: '50px', height: '20px', fontSize: '25px', lineHeight: '1', textAlign: 'left', color: '#000000', borderStyle: 'none', borderWidth: '1px' } },
  { id: v4(), name: 'l-text', props: { text: 'hello2', fontSize: '24px', lineHeight: '2', textAlign: 'right' } },
  { id: v4(), name: 'l-text', props: { text: 'hello3', fontSize: '36px', url: '', actionType: 'url', fontFamily: '' } }
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

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: ''
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
          updateComponent.props[key] = value
        }

      }
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((item) => item.id === state.currentElement)
    }
  }
}

export default editor
