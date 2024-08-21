<template>
  <div class="homepage-container" v-if="withHeader">
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header">
        <router-link to="/">
          <div class="page-title">
            JSCHEN乐高
          </div>
        </router-link>
        <UserProfile :user="user" />

      </a-layout-header>
      <a-layout-content class="home-layout">
        <router-view />
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      © xxx版权所有 | 津ICP备xxx
    </a-layout-footer>
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import UserProfile from '../components/UserProfile.vue'
export default defineComponent({
  name: 'Index',
  components: {
    UserProfile
  },
  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const withHeader = computed(() => route.meta.withHeader)
    const user = computed(() => store.state.user)
    return {
      withHeader,
      user
    }
  }
})
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  color: #fff;
}
</style>
