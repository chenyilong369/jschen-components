import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import UserProfile from '@/components/UserProfile'
import { message } from 'ant-design-vue'
import store from '@/store'

// 1. 用假数据代替
jest.mock('ant-design-vue', () => ({
  message: {
    success: jest.fn()
  }
}))

const routeArr: string[] = []

jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: (url: string) => { routeArr.push(url) }
  })
}))

let wrapper: VueWrapper<any>

const mockComponent = {
  template: '<div> <slot></slot> </div>'
}

const  mockComponent2 = {
  template: '<div> <slot></slot> <slot name="overlay"></slot> </div>'
}

const globalComponents = {
  'a-button': mockComponent,
  'a-dropdown-button': mockComponent2,
  'a-menu': mockComponent,
  'a-menu-item': mockComponent,
  'router-link': mockComponent
}

describe('UserProfile component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    wrapper = mount(UserProfile, {
      props: {
        user: {isLogin: false}
      },
      global: {
        components: globalComponents,
        // 2. provide 导入, 可以获取 store 数据
        provide: {
          store
        }
      }
    })
  })
  it('view login button and isLogin is false', async () => {
    expect(wrapper.get('div').text()).toBe('登录')
    await wrapper.get('div').trigger('click')
    expect(message.success).toHaveBeenCalled()
    expect(store.state.user.userName).toBe('jschen')
  })
  it('view user button and isLogin is true', async() => {
    await wrapper.setProps({
      user: {
        isLogin: true,
        userName: 'jschen'
      }
    })
    expect(wrapper.get('.user-profile-component').html()).toContain('jschen')
    expect(wrapper.find('.user-profile-dropdown').exists()).toBeTruthy
  })
  it('check logout action is alright', async () => {
    await wrapper.get('.user-profile-dropdown div').trigger('click')
    expect(store.state.user.isLogin).toBeFalsy()
    expect(message.success).toHaveBeenCalledTimes(1)
    jest.runAllTimers()
    expect(routeArr).toEqual(['/'])
  })

  afterEach(() => {
    (message as jest.Mocked<typeof message>).success.mockReset()
  })
})
