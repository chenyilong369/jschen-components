import { imageDefaultProps, transformToComponentProps } from "@/defaultProps";
import useComponentCommon from "@/hooks/useComponentCommon";
import { defineComponent } from "vue";

const defaultProps = transformToComponentProps(imageDefaultProps)

export default defineComponent({
  name: 'l-image',
  props: {
    ...defaultProps
  },
  setup(props) {
    const {} = useComponentCommon(props, )
  }
})