<template>
  <div class="layout">
    <Header />
    <Content />
  </div>
</template>

<script setup lang="ts">
import Header from './header/index.vue'
import Content from './content/index.vue'
</script>

<style scoped lang="scss">
.layout {
  width: 100vw;
  height: 100vh;
  min-width: 1200px;
}
</style>
