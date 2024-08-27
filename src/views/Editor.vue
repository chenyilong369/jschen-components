<template>
  <div class="edtior-content">
    <a-row class="content-row">
      <a-col flex="1" class="left">
        <div>组件列表 </div>
        <ComponentsList :list="componentList" @onItemClick="addItem" />
      </a-col>
      <a-col flex="2" class="middle">
        <div class="middle-title">
          画布区域
        </div>
        <div class="draw">
          <EditWrapper v-for="component in components" :key="component.id" :id="component.id" @setActive="setActive"
            :active="component.id === (currentElement && currentElement.id)">
            <component :is="component.name" v-bind="component.props" />
          </EditWrapper>
        </div>
      </a-col>
      <a-col flex="1" class="right">
        <pre>
          {{ currentElement ? currentElement.props : '' }}
        </pre>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import EditWrapper from '../components/EditWrapper.vue'
import ComponentsList from '../components/ComponentsList.vue';
import defaultTextTemplates from '../defaultTemplates'
import { useStore } from 'vuex'
import LText from '../components/LText.vue'
import { GlobalDataProps } from '../store/index'
import { ComponentData } from '../store/editor'
export default defineComponent({
  components: {
    LText,
    ComponentsList,
    EditWrapper
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components)
    const componentList = computed(() => defaultTextTemplates)
    const currentElement = computed<ComponentData | null>(() => store.getters.getCurrentElement)
    const addItem = (props: any) => {
      store.commit('addComponent', props)
    }
    const setActive = (id: string) => {
      store.commit('setActive', id)
    }
    return {
      components,
      addItem,
      componentList,
      setActive,
      currentElement
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
