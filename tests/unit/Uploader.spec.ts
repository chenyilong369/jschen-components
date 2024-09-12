import Uploader from "@/components/Uploader";
import { shallowMount, VueWrapper,flushPromises, mount } from "@vue/test-utils";
import axios from "axios";
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockComponent = {
  template: '<div><slot></slot></div>'
}

const mockComponents = {
  'DeleteOutlined': mockComponent,
  'LoadingOutlined': mockComponent,
  'FileOutlined': mockComponent,
}

const testFile = new File(['abc'], 'text1.png' , {type: 'image/png'})

const setInputValue = (fileInput: any) => {
  const files = [testFile] as any;
  Object.defineProperty(fileInput, 'files', {
    value: files,
    writable: false
  })
}

let wrapper: VueWrapper<any>;
describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: "test.url"
      },
      global: {
        stubs: mockComponents
      }
    })
  })

  it("before update basic layout", () => {
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.get('button span').text()).toBe('点击上传')
    expect(wrapper.get('input').isVisible()).toBeFalsy()
  })

  it("upload process work fine", async () => {
    mockedAxios.post.mockResolvedValueOnce(Promise.resolve().then(() => ({data: 'success'})))
    const fileInput = wrapper.find('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button span').text()).toBe('正在上传')
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')
    expect(wrapper.findAll('li').length).toBe(1)
    const firstItem = wrapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-loading')
    await flushPromises()
    expect(wrapper.get('button span').text()).toBe('点击上传')
    expect(firstItem.classes()).toContain('upload-success')
    expect(firstItem.get('.filename').text()).toBe(testFile.name)
  })

  it('should return error when error', async () => {
    mockedAxios.post.mockResolvedValueOnce(Promise.resolve().catch(e => ({error: 'error'})))
    await wrapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(2)
    expect(wrapper.get('button span').text()).toBe('正在上传')
    await flushPromises()
    expect(wrapper.get('button span').text()).toBe('点击上传')
    expect(wrapper.findAll('li').length).toBe(2)
    const lastItem = wrapper.get('li:last-child')
    expect(lastItem.classes()).toContain('upload-error')
    await lastItem.get('.delete-icon').trigger('click')
    expect(wrapper.findAll('li').length).toBe(1)
  })

  it.only('should show the current component when using custom slot', async () => {
    mockedAxios.post.mockResolvedValueOnce(Promise.resolve().then(() => ({data: {url: 'test1.url'}})))
    const wrapper = mount(Uploader, {
      props: {
        action: 'test.url'
      },
      slots: {
        default: '<button>Custom slot</button>',
        loading: '<div class="loading">loading slot</div>',
        uploaded: `
          <template #uploaded="{uploadData}">
            <div class="custom-loaded">{{ uploadData.url }}</div>
          </template>
        `
      },
      global: {
        stubs: mockComponents
      }
    })
    expect(wrapper.get('button').text()).toBe('Custom slot')
    const fileInput = wrapper.find('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('.loading').text()).toBe('loading slot')
    await flushPromises()
    expect(wrapper.get('.custom-loaded').text()).toBe('test1.url')
  })
})