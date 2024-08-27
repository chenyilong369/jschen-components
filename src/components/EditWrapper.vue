<template>
  <div class="edit-wrapper"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    id: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped> 
.edit-wrapper {
  padding: 0;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;

  &:hover {
    border: 1px solid #ccc;
  }

  &:active {
    border: 1px solid #1890ff
  }
}
</style>
