<template>
  <div class="content-container">
    <template-list :list="testData"></template-list>
    <!-- <a-row type="flex" justify="center">
      <a-button type="primary" size="large" @click="loadMorePage" v-if="!isLastPage" :loading="isLoading">加载更多</a-button>
    </a-row> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import TemplateList from '../components/TemplateList.vue'
export default defineComponent({
  components: {
    TemplateList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const testData = computed(() => store.state.templates.data)
    return {
      testData
    }
  }
})
</script>

<style>
.page-title {
  color: #fff;
}

.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>