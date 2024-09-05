import ColorPicker from "@/components/ColorPicker"
import { VueWrapper, mount } from "@vue/test-utils"
const defaultColors = ['#ffffff', '#f5222d', '#fa541c', '#fadb14', '#52c41a', '#1890ff', '#722ed1', '#8c8c8c', '#000000', '']

let wrapper: VueWrapper<any>
describe('test color-picker component', () => {
  beforeAll(() => {
    wrapper = mount(ColorPicker, {
      props: {
        color: '#ffffff'
      }
    }) 
  })

  it.only('check component is render fine', () => {
    expect(wrapper.find('input').exists).toBeTruthy()
    const input = wrapper.get('input').element
    expect(input.type).toBe('color')
    expect(input.value).toBe('#ffffff')
    expect(wrapper.findAll('.picked-color-list li').length).toBe(defaultColors.length)
    const firstItem = wrapper.get('li:first-child div').element as HTMLElement
    expect(firstItem.style.backgroundColor).toBe(defaultColors[0])
    const lastItem = wrapper.get('li:last-child div').element as HTMLElement
    expect(lastItem.classList.contains('transparent-back')).toBeTruthy()
  }) 

  it('shuold send the corrent event when click left input', async () => {
    const black = '#000000'
    const input = wrapper.get('input')
    await input.setValue(black)
    expect(wrapper.emitted).toHaveProperty('change')
    const events = wrapper.emitted('change')
    expect(events?.[0]).toEqual([black])
  })

  it('should send the corrent event when click right color list', async () => {
    const firstItem = wrapper.get('li:first-child div')
    await firstItem.trigger('click')
    const events = wrapper.emitted('change')
    expect(events?.[1]).toEqual([defaultColors[0]])
  })
})