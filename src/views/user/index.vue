<template>
  <el-card class="container">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/user' }">当前模块</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮组 -->
    <div class="btn-group">
      <el-button @click="openAddUser"> 添加 </el-button>
    </div>
    <!-- 信息表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column prop="keptPets" label="宠物经验">
        <template #default="scope">
          <span v-if="scope.row.keptPets">有</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="phoneNum" label="电话号码"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div class="flex-group">
            <el-tag @click="check(scope.row)" effect="dark" round> 查看 </el-tag>
            <el-tag type="warning" @click="openEdit(scope.row)" effect="dark" round> 编辑 </el-tag>
            <el-popconfirm
              hide-icon
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="确认删除？"
              @confirm="deleteUser(scope.row)"
            >
              <template #reference>
                <el-tag type="danger" effect="dark" round> 删除 </el-tag>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="pagination.pageNum"
      v-model:page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total"
      @current-change="handleCurrentChange"
    />
    <!-- 用户信息对话框 -->
    <el-dialog v-model="editDialog" :title="dialogTitle" :close-delay="50">
      <el-form
        ref="editFormRef"
        :model="editFormData"
        label-width="150px"
        :rules="editRules"
        :hide-required-asterisk="true"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input :disabled="isCheck" v-model="editFormData.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input :disabled="isCheck" v-model="editFormData.password"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input :disabled="isCheck" v-model="editFormData.nickName"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input :disabled="isCheck" v-model="editFormData.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select :disabled="isCheck" placeholder="选择性别" v-model="editFormData.sex">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="宠物经验" prop="keptPets">
          <el-select
            :disabled="isCheck"
            placeholder="是否有过宠物经验"
            v-model="editFormData.keptPets"
          >
            <el-option
              v-for="item in keptPetsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input :disabled="isCheck" v-model="editFormData.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input :disabled="isCheck" v-model="editFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input :disabled="isCheck" v-model="editFormData.address"></el-input>
        </el-form-item>
        <el-form-item label="个人介绍">
          <el-input
            :disabled="isCheck"
            type="textarea"
            :autosize="{ minRows: 5 }"
            v-model="editFormData.introduction"
          ></el-input>
        </el-form-item>
        <div class="form_buttons">
          <el-button v-if="isCheck" @click="closeEditDialog(editFormRef)" type="primary">确认</el-button>
          <el-button v-else @click="submitEditUser(editFormRef)" type="primary">提交</el-button>
          <el-button @click="closeEditDialog(editFormRef)" type="info">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, Ref, computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

// 分页列表
let tableData: INFO.UserInfo[] = reactive([])
const pagination: Ref<INFO.pagination> = ref({
  pageNum: 1,
  pageSize: 10,
  total: 20
})
const handleCurrentChange = () => {
  console.log('分页请求获取数据列表', pagination.value)
}

// 编辑表单
const formType = ref(0) // 0：编辑表单, 1:添加表单 2：查看表单
const editFormRef = ref<FormInstance>()
const editDialog = ref(false)
const INITDATA = {
  userId: '',
  nickName: '',
  userName: '',
  password: '',
  age: 0,
  address: '',
  phoneNum: '',
  sex: '',
  email: '',
  introduction: '',
  keptPets: false
}
const editFormData = reactive({
  ...INITDATA
})
const editRules = reactive<FormRules>({
  nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  userName: [{ required: true, message: '用户名不能够为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
  sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  // address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
  // phoneNum: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
  // email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
  // introduction: [{ required: true, message: '介绍不能为空', trigger: 'blur' }],
  keptPets: [{ required: true, message: '宠物经验不能为空', trigger: 'blur' }]
})
const sexOptions = [
  {
    value: '男生',
    label: '男生'
  },
  {
    value: '女生',
    label: '女生'
  }
]
const keptPetsOptions = [
  {
    label: '无',
    value: false
  },
  {
    label: '有',
    value: true
  }
]
const submitEditUser = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formType.value === 0) {
        console.log('发送请求，改变当前角色信息', editFormData)
        ElMessage({
          message: '更新角色信息成功',
          type: 'success'
        })
      } else {
        console.log('发送请求，创建当前角色', editFormData)
        ElMessage({
          message: '添加角色成功',
          type: 'success'
        })
      }
      console.log('发送请求, 重新刷新数据列表')
      editDialog.value = false
    } else {
      console.log('表单校验失败', fields)
    }
  })
}
const closeEditDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (!isCheck.value) formEl.resetFields()
  editDialog.value = false
}

// 添加用户
const openAddUser = () => {
  formType.value = 1
  editFormData.address = ''
  editFormData.age = 0
  editFormData.email = ''
  editFormData.introduction = ''
  editFormData.keptPets = false
  editFormData.nickName = ''
  editFormData.password = ''
  editFormData.phoneNum = ''
  editFormData.sex = '男生'
  editFormData.userName = ''
  editDialog.value = true
}

// 表格操作（查看，编辑，删除）
const check = (row: INFO.UserInfo) => {
  formType.value = 2
  editFormData.address = row.address
  editFormData.age = row.age
  editFormData.email = row.email
  editFormData.introduction = row.introduction
  editFormData.keptPets = row.keptPets
  editFormData.nickName = row.nickName
  editFormData.password = row.password
  editFormData.phoneNum = row.phoneNum
  editFormData.sex = row.sex
  editFormData.userName = row.userName
  editDialog.value = true
}
const openEdit = (row: INFO.UserInfo) => {
  formType.value = 0
  editFormData.userId = row.userId
  editFormData.address = row.address
  editFormData.age = row.age
  editFormData.email = row.email
  editFormData.introduction = row.introduction
  editFormData.keptPets = row.keptPets
  editFormData.nickName = row.nickName
  editFormData.password = row.password
  editFormData.phoneNum = row.phoneNum
  editFormData.sex = row.sex
  editFormData.userName = row.userName
  editDialog.value = true
}
const deleteUser = (row: INFO.UserInfo) => {
  console.log('发送请求删除用户信息', row.userId)
  console.log('发送请求，重新刷新数据列表')
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}

const isCheck = computed(() => {
  return formType.value === 2
})
const dialogTitle = computed(() => {
  return formType.value === 0 ? '编辑用户信息' : (formType.value === 1 ? '添加用户' : '查看用户')
})

// 初始化操作
const init = () => {
  console.log('发送请求获取用户列表')
  tableData = [
    {
      userId: 'a',
      nickName: '谢忠豪',
      userName: 'morty',
      password: '123456',
      age: 22,
      keptPets: false,
      phoneNum: '123456789',
      email: '48979@qq.com',
      address: '开县',
      introduction: 'bad boy',
      sex: '男生'
    },
    {
      userId: 'a',
      nickName: '谢忠豪',
      userName: 'morty',
      password: '123456',
      age: 22,
      keptPets: false,
      phoneNum: '123456789',
      email: '48979@qq.com',
      address: '开县',
      introduction: 'bad boy',
      sex: '男生'
    }
  ]
}
init()
</script>

<style scoped lang="scss">
.container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  .el-pagination {
    position: absolute;
    bottom: 5px;
  }
  .el-table {
    margin-bottom: 50px;
  }
}
.flex-group {
  display: flex;
  flex-wrap: wrap;
  .el-tag {
    margin: 0 5px 5px 0;
    cursor: pointer;
  }
}
.btn-group {
  display: flex;
  justify-content: right;
}
.el-table {
  margin-top: 10px;
}
.el-form {
  .form_buttons {
    display: flex;
    justify-content: space-around;
    button {
      width: 100px;
    }
  }
  .el-input {
    width: 70%;
  }
}
</style>
