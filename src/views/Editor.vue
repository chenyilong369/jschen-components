<template>
  <div class="edtior-content">
    <a-row class="content-row">
      <a-col flex="1" class="left">组件列表</a-col>
      <a-col flex="2" class="middle">
        <div class="middle-title">
          画布区域
        </div>
        <div class="draw">
          <component :is="component.name" v-bind="component.props" v-for="component in components"
            :key="component.id" />
        </div>
      </a-col>
      <a-col flex="1" class="right">300px</a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import LText from '../components/LText.vue'
import { GlobalDataProps } from '../store/index'
export default defineComponent({
  components: {
    LText
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components)
    return {
      components
    }
  }
})
</script>

<style lang="scss" scoped>
.edtior-content {
  min-height: 92vh;

  .content-row {
    min-height: inherit;

    .left {
      background-color: yellow
    }

    .middle {
      background-color: #ccc;
      display: flex;
      flex-direction: column;
      align-items: center;

      .middle-title {
        margin-top: 70px;
        font-size: 16px;
      }

      .draw {
        margin-top: 50px;
        width: 70%;
        height: 200px;
        position: relative;
        background-color: #fff;
      }
    }

    .right {
      background-color: purple;
    }
  }

}
</style>
