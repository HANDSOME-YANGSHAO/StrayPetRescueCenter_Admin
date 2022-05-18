<template>
  <el-card class="container">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/donation/notice' }">收支记录</el-breadcrumb-item>
      <el-breadcrumb-item>通告</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮组 -->
    <div class="btn-group">
      <el-button @click="openAdd"> 添加 </el-button>
    </div>
    <!-- 信息表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="publishTime" label="发布时间"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="content" label="内容">
        <template #default="scope">
          <div class="content">
            {{ scope.row.content }}
          </div>
        </template>
      </el-table-column>
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
              @confirm="deleteNotice(scope.row)"
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
    <!-- 书本信息对话框 -->
    <el-dialog v-model="dialogVisible" title="通告">
      <div v-if="isCheck">
        <div class="dialog-item">
          <div class="label">{{ '标题:' }}</div>
          <div class="describe">{{ formData.title }}</div>
        </div>
        <div class="dialog-item">
          <div class="label">{{ '内容:' }}</div>
          <div class="describe">{{ formData.content }}</div>
        </div>
      </div>
      <el-form
        v-else
        ref="formRef"
        :model="formData"
        label-width="150px"
        :rules="formRules"
        :hide-required-asterisk="true"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5 }"
            v-model="formData.content"
          ></el-input>
        </el-form-item>
        <div class="form_buttons">
          <el-button v-if="isCheck" @click="closeEditDialog(formRef)" type="primary"
            >确定</el-button
          >
          <el-button v-else @click="submitEdit(formRef)" type="primary">提交</el-button>
          <el-button @click="closeEditDialog(formRef)" type="info">取消</el-button>
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
let tableData: INFO.Notice[] = reactive([])
const pagination: Ref<INFO.pagination> = ref({
  pageNum: 1,
  pageSize: 6,
  total: 20
})
const handleCurrentChange = () => {
  console.log('分页请求获取数据列表', pagination.value)
}

// 书籍对话框和表单
const formRef = ref<FormInstance>()
const formType = ref(0) // 0:编辑表单 1：添加表单 2: 查看
const dialogVisible = ref(false)
const isCheck = computed(() => {
  return formType.value === 2
})
const formData = reactive({
  noticeId: '',
  title: '',
  content: ''
})
const formRules = reactive<FormRules>({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
})
const submitEdit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formType.value === 0) {
        console.log('发送请求，改变通告信息', formData)
        ElMessage({
          message: '更新成功',
          type: 'success'
        })
      } else {
        console.log('发送请求，添加通告', formData)
        ElMessage({
          message: '添加成功',
          type: 'success'
        })
      }
      console.log('发送请求, 重新刷新数据列表')
      dialogVisible.value = false
    } else {
      console.log('表单校验失败', fields)
    }
  })
}
const closeEditDialog = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  if (!isCheck.value) formEl.resetFields()
  dialogVisible.value = false
}

// 列表操作（增删查改）
const check = (row: INFO.Notice) => {
  formType.value = 2
  formData.title = row.title
  formData.content = row.content
  dialogVisible.value = true
}
const openEdit = (row: INFO.Notice) => {
  formType.value = 0
  formData.noticeId = row.noticeId
  formData.title = row.title
  formData.content = row.content
  dialogVisible.value = true
}
const openAdd = () => {
  formType.value = 1
  formData.title = ''
  formData.content = ''
  dialogVisible.value = true
}
const deleteNotice = (row: INFO.Notice) => {
  console.log(`根据通告id：${row.noticeId}发送请求，删除当前通告`)
  console.log('发送请求，重新刷新数据列表')
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}

// 初始化
const init = () => {
  console.log('发送请求，获取通告列表数据')
  tableData = [
    {
      noticeId: 'n6',
      title: '第六期通告',
      content: '第六期募捐内容',
      publishTime: '2022.5.18 19:11'
    },
    {
      noticeId: 'n5',
      title: '第五期通告',
      content: '第五期募捐内容',
      publishTime: '2022.5.18 19:11'
    },
    {
      noticeId: 'n4',
      title: '第四期通告',
      content: '第四期募捐内容',
      publishTime: '2022.5.18 19:11'
    },
    {
      noticeId: 'n3',
      title: '第三期通告',
      content: '第三期募捐内容',
      publishTime: '2022.5.18 19:11'
    },
    {
      noticeId: 'n2',
      title: '第二期通告',
      content: '第二期募捐内容',
      publishTime: '2022.5.18 19:11'
    },
    {
      noticeId: 'n1',
      title: '第一期通告',
      content: '第一期募捐内容',
      publishTime: '2022.5.18 19:11'
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
  .el-dialog {
    .dialog-item {
      display: flex;
      .label {
        text-align: right;
        width: 100px;
        line-height: 32px;
        font-size: 15px;
        font-weight: bold;
        color: #606266;
      }
      .describe {
        margin-left: 50px;
        width: 70%;
        font-size: 14px;
        line-height: 32px;
      }
    }
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
  .content {
    line-height: 20px;
    max-width: 6rem;
    height: 80px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .center {
    display: flex;
    align-items: center;
    height: 100px;
    img {
      width: 54px;
      height: 78px;
    }
  }
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
