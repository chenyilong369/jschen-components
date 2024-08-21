<template>
  <div class="work-detail-container">
    <a-row type="flex" justify="center" v-if="template">
      <a-col :span="8" class="cover-img">
        <a :href="template.coverImg"><img :src="template.coverImg" alt="" id="cover-img" /></a>
      </a-col>
      <a-col :span="8">
        <h2>{{ template.title }}</h2>
        <div class="author">
          <a-avatar>V</a-avatar>
          该模版由 <b>{{ template.author }}</b> 创作
        </div>
        <div class="bar-code-area">
          <span>扫一扫，手机预览</span>
          <canvas id="barcode-container"></canvas>
        </div>
        <div class="use-button">
          <router-link to="/editor">
            <a-button type="primary" size="large">
              使用模版
            </a-button>
          </router-link>
          <a-button size="large">
            下载图片海报
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { GlobalDataProps } from '../store/index'
import {TemplateProps} from '../store/templates'
export default defineComponent({
  setup() {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const currentId = route.params.id as string
    const template = computed<TemplateProps>(() => store.getters.getTemplateById(parseInt(currentId)))
    return {
      template,
    }
  }
})
</script>

<style lang="scss" scoped>
.work-detail-container {
  margin-top: 50px;

  .cover-img {
    margin-right: 30px;


    img {
      width: 100%;
    }

    .use-button {
      margin: 30px 0;
    }
  }

  .ant-avatar {
    margin-right: 10px;
  }

  .bar-code-area {
    margin: 20px 0;
  }

  #barcode-container {
    display: block;
  }
}
</style>
