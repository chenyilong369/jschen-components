import { defineComponent, h, resolveComponent } from 'vue';
import useComponentCommon from '../hooks/useComponentCommon'
import '@/styles/components/LText.scss'
import { transformToComponentProps, textDefaultProps, textStylePropsName } from '../defaultProps'
const defaultProps = transformToComponentProps(textDefaultProps)
export default defineComponent({
  name: 'l-text',
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    ...defaultProps
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon(props, textStylePropsName)
    return () => (
      <>
        {
          h(resolveComponent(props.tag), { style: styleProps.value, class: "l-text-component", onClick: handleClick }, props.text)
        }
      </>
    )
  }
})