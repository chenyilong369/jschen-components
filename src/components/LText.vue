<template>
  <component :is="tag" :style="styleProps" class="l-text-component" @click="handleClick">
    {{ text }}
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useComponentCommon from '../hooks/useComponentCommon'
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
    return {
      styleProps,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
.l-text-component {
  box-sizing: border-box;
  position: relative !important;
}
</style>