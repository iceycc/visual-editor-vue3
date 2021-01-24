<template>
  <div class="app">
    <h1>这是内容页面</h1>
    <VisualEditor v-model="modelValue" :config="visualConfig"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {VisualEditor} from './packages/visual-editor'
import {visualConfig} from './visual.config'

export default defineComponent({
  name: 'App',
  components: {
    VisualEditor,
  },
  data() {
    return {
      visualConfig,
      modelValue: {
        container: {
          width: 500,
          height: 800
        },
        blocks: [
          {
            top: 10,
            left: 10
          },
          {
            top: 200,
            left: 200
          },
        ]
      }
    }
  }
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0
}
</style>
