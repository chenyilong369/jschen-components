import Uploader from "@/components/Uploader";
import { shallowMount, VueWrapper,flushPromises } from "@vue/test-utils";
import axios from "axios";
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const testFile = new File(['abc'], 'text1.png' , {type: 'image/png'})

let wrapper: VueWrapper<any>;
describe('Uploader Component', () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: "test.url"
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
    const files = [testFile] as any;
    Object.defineProperty(fileInput, 'files', {
      value: files,
      writable: false
    })
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
})