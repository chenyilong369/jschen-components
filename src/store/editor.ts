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
  props: Partial<AllComponentProps>;
  id: string;
  name: string;
}

export const testComponents = [
  { id: v4(), name: 'l-text', props: { text: 'hello1', width: '50px', height: '20px', fontSize: '25px', lineHeight: '1', textAlign: 'left', color: '#000000', borderStyle: 'none', borderWidth: '1px' } },
  { id: v4(), name: 'l-text', props: { text: 'hello2', fontSize: '24px', lineHeight: '2', textAlign: 'right' } },
  { id: v4(), name: 'l-text', props: { text: 'hello3', fontSize: '36px', url: '', actionType: 'url', fontFamily: '' } }
]

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
    updateComponent(state, { key, value }: UpdateComponentData) {
      const updateComponent = state.components.find((item) => item.id === state.currentElement)
      if (updateComponent) {
        updateComponent.props[key] = value
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
