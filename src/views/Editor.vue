<template>
  <div class="edtior-content">
    <a-row class="content-row">
      <a-col flex="1" class="left">组件列表</a-col>
      <a-col flex="2" class="middle">
        <div class="middle-title">
          画布区域
        </div>
        <div class="draw"></div>
      </a-col>
      <a-col flex="1" class="right">300px</a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({

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
        background-color: #fff;
      }
    }

    .right {
      background-color: purple;
    }
  }

}
</style>
