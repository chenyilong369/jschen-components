import { TextComponentProps } from '@/defaultProps'
import { mapPropsToForms, PropToForms } from '@/propsMap'
import { reduce } from 'lodash-es'
import '@/styles/components/PropsTable.scss'
import { defineComponent, computed, PropType, h, resolveComponent } from 'vue'
import { transformEventName } from '@/utils/transform'

interface FormProps {
  component: string;
  subComponent?: string;
  text?: string;
  value: string;
  extraProps?: {[key: string]: any};
  options?: { text: string; value: any }[];
  initalTransform?: (v: any) => any;
  valueProp: string;
  eventName: string;
  events: { [key: string]: (e: any) => void };
}

export default defineComponent({
  name: 'props-table',
  props: {
    props: {
      type: Object as PropType<{ [key: string]: any }>
    }
  },
  emits: ['change'],
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(props.props, (result, value, key) => {
        const newKey = key as keyof TextComponentProps
        const item = mapPropsToForms[newKey]
        if (item) {
          const {valueProp = 'value', eventName = 'change', initalTransform} = item
          const newItem: FormProps = {
            ...item,
            valueProp,
            eventName,
            value: initalTransform ? initalTransform(value) : value,
            events: {
              [transformEventName(eventName)]: (e: any) => { context.emit('change', { key, value: e }) }
            }
          }
          result[newKey] = newItem
        }
        return result
      }, {} as {[key: string]: FormProps})
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
                    value ? h(resolveComponent(value.component), { [value.valueProp]: value.value, ...value.events, ...value.extraProps }, {
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
