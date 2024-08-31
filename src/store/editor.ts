import { GlobalDataProps } from ".";
import { TextComponentProps } from '../defaultProps'
import { Module } from "vuex";
import { v4 } from 'uuid'

export interface EditorProps {
  components: ComponentData[];
  currentElement: string; // 当前选中组件id
}

export interface ComponentData {
  props: { [key: string]: any };
  id: string;
  name: string;
}

export const testComponents = [
  { id: v4(), name: 'l-text', props: {text: 'hello1', fontSize: '12px', lineHeight: '1', color: 'red'} },
  { id: v4(), name: 'l-text', props: {text: 'hello2', fontSize: '24px', lineHeight: '2' } },
  { id: v4(), name: 'l-text', props: {text: 'hello3', fontSize: '36px', url: '', actionType: 'url'} }
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: ''
  },
  mutations: {
    addComponent(state, props: Partial<TextComponentProps>) {
      const newComponent: ComponentData = {
        id: v4(),
        name: 'l-text',
        props
      }
      state.components.push(newComponent)
    },
    setActive(state, currentId: string) {
      state.currentElement = currentId
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((item) => item.id === state.currentElement)
    }
  }
}

export default editor
