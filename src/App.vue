<script setup lang="ts">
import { useRouteStore } from 'stores/route'
// import { onBeforeMount } from 'vue'
// import HTTP from '@/API/test'

// onBeforeMount(async () => {
//   const res = await HTTP.getCategory()
//   console.log(res)
// })

// 初始化状态管理库
const routeStore = useRouteStore()
routeStore.setUserInfo()
routeStore.setMenuList()
</script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style scoped lang="scss"></style>
