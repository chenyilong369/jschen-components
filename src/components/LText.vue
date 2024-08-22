<template>
  <component :is="tag" :style="styleProps" class="l-text-component">
    {{ text }}
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { pick } from 'lodash-es'
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
    const styleProps = pick(props, textStylePropsName)
    return {
      styleProps
    }
  }
})
</script>

<style lang="scss" scoped>
.l-text-component {
  box-sizing: border-box;
}
</style>