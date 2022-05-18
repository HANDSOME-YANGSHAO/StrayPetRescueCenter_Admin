<template>
  <el-header>
    <div class="logo_box">
      <img src="../../../assets/catLogo.png"/>
      <span>流浪宠物救助中心后台管理系统</span>
    </div>
    <el-button @click="logout">退出</el-button>
  </el-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const logout = () => {
  window.sessionStorage.clear()
  ElMessage({
    message: '退出登陆',
    type: 'success'
  })
  router.push('/login')
}
</script>

<style scoped lang="scss">
.el-header {
  width: 100%;
  background-color: rgb(247, 127, 28);
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    width: 70%;
    display: flex;
    align-items: center;
    img {
      margin-left: 20px;
      height: 80px;
      width: 58px;
      border-radius: 50%;
    }
    span {
      width: 500px;
      padding-left: 120px;
      font-size: 30px;
      color: #fff;
    }
  }
  .el-button {
    &:hover {
      background-color: #fff;
    }
  }
}
</style>
