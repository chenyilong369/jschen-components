import { imageDefaultProps, imageStylePropsNames, transformToComponentProps } from "@/defaultProps";
import useComponentCommon from "@/hooks/useComponentCommon";
import { CSSProperties, defineComponent, withModifiers } from "vue";
import '@/styles/components/LImage.scss'
const defaultProps = transformToComponentProps(imageDefaultProps)

export default defineComponent({
  name: 'l-image',
  props: {
    ...defaultProps
  },
  setup(props) {
    const { styleProps, handleClick } = useComponentCommon(props, imageStylePropsNames)
    return () => (
      <img
        style={styleProps.value as CSSProperties}
        class="l-image-component"
        src={props.src}
        onClick={withModifiers(handleClick, ['prevent'])}
      />
    )
  }
})