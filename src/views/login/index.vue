<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="box_avatar">
        <img src="../../assets/avatar.jpeg" />
      </div>
      <!-- 登陆的表单区域 -->
      <div class="login_form">
        <el-form ref="loginFormRef" label-width="0px" :model="formData" :rules="loginFormRules">
          <el-form-item prop="account">
            <el-input
              placeholder="用户名"
              :prefix-icon="UserFilled"
              v-model="formData.account"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              :prefix-icon="Unlock"
              v-model="formData.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form_buttons">
              <el-button @click="login(loginFormRef)" type="primary">登陆</el-button>
              <!-- <el-button @click="click" type="primary">登陆</el-button> -->
              <el-button @click="resetloginForm(loginFormRef)">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UserFilled, Unlock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRouteStore } from 'stores/route'

// 表单初始化
const formData = reactive({
  account: '',
  password: ''
})
const loginFormRules = reactive<FormRules>({
  account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
})
const loginFormRef = ref<FormInstance>()

// 引入路由
const router = useRouter()

// 引入公共状态库
const routeStore = useRouteStore()

// 具体的登陆逻辑
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formData.account === '123456') {
        console.log('发送请求，进行登陆, 保存token')
        const res = {
          // 假数据
          userInfo: {
            account: '123456',
            userName: '李老三',
            role: '3'
          },
          token: 'fake_token'
        }
        routeStore.setUserInfo(res.userInfo)
        routeStore.setMenuList()
        window.sessionStorage.setItem('token', res.token)
        window.sessionStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        ElMessage({
          message: '登陆成功',
          type: 'success'
        })
        router.push('/user')
      } else if (formData.account === 'abc') {
        console.log('发送请求，进行登陆, 保存token')
        const res = {
          // 假数据
          userInfo: {
            account: 'abc',
            userName: '李老三',
            role: '4'
          },
          token: 'fake_token'
        }
        routeStore.setUserInfo(res.userInfo)
        routeStore.setMenuList()
        window.sessionStorage.setItem('token', res.token)
        window.sessionStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        ElMessage({
          message: '登陆成功',
          type: 'success'
        })
        router.push('/user')
      } else {
        ElMessage({
          message: '账号或密码错误，请重新输入',
          type: 'error'
        })
      }
    } else {
      console.log('请按照正确格式输入账号密码！', fields)
    }
  })
}
const resetloginForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped lang="scss">
.login_container {
  min-width: 1200px;
  height: 100vh;
  background: url('../../assets/e.jpg') no-repeat;
  background-size: 100% 100%;
  position: relative;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 2px 2px rgba(0, 0, 0, 0.2);
  }
}
.box_avatar {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;
  .form_buttons {
    display: flex;
    justify-content: space-between;
    button {
      width: 199px;
    }
  }
}
</style>
