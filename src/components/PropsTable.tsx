import { TextComponentProps } from '@/defaultProps'
import { mapPropsToForms, PropToForms } from '@/propsMap'
import { reduce } from 'lodash-es'
import { defineComponent, computed, PropType, h, resolveComponent } from 'vue'
export default defineComponent({
  name: 'props-table',
  props: {
    props: {
      type: Object as PropType<{ [key: string]: any }>
    }
  },
  setup(props) {
    const finalProps = computed(() => {
      return reduce(props.props, (result, value, key) => {
        const newKey = key as keyof TextComponentProps
        const item = mapPropsToForms[newKey]
        if (item) {
          item.value = value
          result[newKey] = item
        }
        return result
      }, {} as PropToForms)
    })
    return () => (
      <div class="props-table">
        {
          Object.keys(finalProps.value).map((key: string) => {
            const newKey = key as keyof PropToForms
            const value = finalProps.value[newKey]
            return (
              <div class="prop-item" key={key}>
                {
                  value ? h(resolveComponent(value.component), { value: value.value }) : ''
                }
              </div>
            )})
        }
      </div>
    )
  }
})
