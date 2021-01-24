<template>
<div class="app">
  <h1>这是内容页面</h1>
  <VisualEditor/>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {VisualEditor} from './packages/visual-editor'
export default defineComponent({
  name: 'App',
  components: {
    VisualEditor
  }
});
</script>

<style>
html,body {
  margin:0;
  padding:0
}
</style>
