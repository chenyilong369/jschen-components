import { TextComponentProps } from '@/defaultProps'
import { mapPropsToForms, PropToForms } from '@/propsMap'
import { reduce } from 'lodash-es'
import '@/styles/components/PropsTable.scss'
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
          item.value = item.initalTransform ? item.initalTransform(value) : value
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
                  value?.text ? <span class="label">{value.text}</span> : ''
                }
                <div class="prop-component">
                  {
                    value ? h(resolveComponent(value.component), { value: value.value, ...value.extraProps }, {
                      default: () => (
                        value.options && value.subComponent ? value.options.map((option) => (
                          <>
                            {
                              h(resolveComponent(value.subComponent!), {key: option.value, value: option.value}, {
                                default: () => option.text,
                              })
                            }
                          </>
                        )) : undefined
                      )
                    }) : ''
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
})
