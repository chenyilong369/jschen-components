<template>
  <div class="create-component-list">
    <div v-for="(item, index) in list" :key="index" @click="onItemClick(item)" class="component-wrapper">
      <LText v-bind="item"></LText>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LText from './LText.vue'
export default defineComponent({
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  emits: ['itemClick'],
  name: 'components-list',
  components: {
    LText
  },
  setup(props, context) {
    const onItemClick = (data: any) => {
      context.emit("itemClick", data)
    };
    return {
      onItemClick
    }
  }
})
</script>

<style lang="scss" scoped>
.create-component-list {

  .component-wrapper {
  }
}
</style>
