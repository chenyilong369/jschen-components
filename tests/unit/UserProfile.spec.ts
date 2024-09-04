import { VueWrapper, mount, shallowMount } from '@vue/test-utils'
import { UserProps } from '@/store/user'
import UserProfile from '@/components/UserProfile.tsx'

jest.mock('ant-design-vue')
jest.mock('vuex')
jest.mock('vue-router')

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
    wrapper = mount(UserProfile, {
      props: {
        user: {isLogin: false}
      },
      global: {
        components: globalComponents
      }
    })
  })
  it('view login button and isLogin is false', async () => {
    expect(wrapper.get('div').text()).toBe('登录')
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
})
