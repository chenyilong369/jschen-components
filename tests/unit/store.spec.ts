import { TextComponentProps } from "@/defaultProps";
import store from "@/store";
import { testComponents } from "@/store/editor";
import { testData } from "@/store/templates";
import { clone } from "lodash";
const cloneComponents = clone(testComponents)

describe('test vuex', () => {
  it('should have three modules', () => {
    expect(store.state).toHaveProperty('user')
    expect(store.state).toHaveProperty('templates')
    expect(store.state).toHaveProperty('editor')
  })

  describe('test user module', () => {
    it('test login mutation', () => {
      store.commit('login')
      expect(store.state.user.isLogin).toBeTruthy()
    })
    it('test logout mutation', () => {
      store.commit('logout')
      expect(store.state.user.isLogin).toBeFalsy()
    })
  })

  describe('test template module', () => {
    it('should have default value', () => {
      expect(store.state.templates.data).toHaveLength(testData.length)
    })
    it('test getTemplateById is ok', () => {
      const selectTemplate = store.getters.getTemplateById(1)
      expect(selectTemplate.title).toBe('sdasd1')
    })
  })

  describe('test editor module', () => {
    it('should have default value', () => {
      expect(store.state.editor.components).toHaveLength(testComponents.length)
    })
    it('should get current element when set active one component', () => {
      const testId = testComponents[0].id
      store.commit('setActive', testId)
      expect(store.state.editor.currentElement).toBe(testId)
      const currentElement = store.getters.getCurrentElement
      expect(currentElement.id).toBe(testId)
    })
    it('add component should work fine', () => {
      const payload: Partial<TextComponentProps> ={
        text: 'text1'
      }
      store.commit('addComponent', payload)
      expect(store.state.editor.components).toHaveLength(cloneComponents.length + 1)
    })
  })
})

