import store from "@/store";
import { testData } from "@/store/templates";

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
})

