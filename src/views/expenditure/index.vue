<template>
  <el-card class="container">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/donation/expenditure' }">收支记录</el-breadcrumb-item>
      <el-breadcrumb-item>支出记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮组 -->
    <div class="btn-group">
      <el-button @click="openAdd"> 添加 </el-button>
    </div>
    <!-- 信息表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="publishTime" label="发布时间"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="pay" label="支出"></el-table-column>
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
    <!-- 信息对话框 -->
    <el-dialog v-model="dialogVisible" title="通告">
      <div v-if="isCheck">
        <div class="dialog-item">
          <div class="label">{{ '标题:' }}</div>
          <div class="describe">{{ formData.title }}</div>
        </div>
        <div class="dialog-item">
          <div class="label">{{ '支出:' }}</div>
          <div class="describe">{{ formData.pay }}</div>
        </div>
        <div class="dialog-item">
          <div class="label">{{ '内容:' }}</div>
          <div class="describe">{{ formData.content }}</div>
        </div>
        <div class="dialog-item">
          <div class="label">{{ '图片:' }}</div>
          <div class="dialog-imgList">
            <img v-for="item in formData.imgList" :key="item" :src="item" alt="图片" />
          </div>
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
        <el-form-item label="支出" prop="pay">
          <el-input v-model="formData.pay"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 5 }"
            v-model="formData.content"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="imgDialogVisible">
            <img w-full :src="dialogImageUrl" alt="图片预览" />
          </el-dialog>
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
import { ArrowRight, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'

// 分页列表
let tableData: INFO.Expenditure[] = reactive([])
const pagination: Ref<INFO.pagination> = ref({
  pageNum: 1,
  pageSize: 5,
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
  id: '',
  title: '',
  content: '',
  pay: '',
  imgList: []
  // 这里应该还需要图片啥的
})
const formRules = reactive<FormRules>({
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  pay: [{ required: true, message: '支出金额不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
})
const submitEdit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formType.value === 0) {
        console.log('发送请求，改变支出记录信息', formData)
        ElMessage({
          message: '更新成功',
          type: 'success'
        })
      } else {
        console.log('发送请求，添加支出记录', formData)
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
const check = (row: INFO.Expenditure) => {
  formType.value = 2
  formData.title = row.title
  formData.content = row.content
  formData.pay = row.pay
  formData.imgList = row.imgList
  dialogVisible.value = true
}
const openEdit = (row: INFO.Expenditure) => {
  formType.value = 0
  formData.id = row.id
  formData.title = row.title
  formData.content = row.content
  formData.pay = row.pay
  dialogVisible.value = true
}
const openAdd = () => {
  formType.value = 1
  formData.title = ''
  formData.content = ''
  formData.pay = ''
  dialogVisible.value = true
}
const deleteNotice = (row: INFO.Expenditure) => {
  console.log(`根据id：${row.id}发送请求，删除当前支出记录`)
  console.log('发送请求，重新刷新数据列表')
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}

// 图片上传
const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2018%2F018%2F745%2F8678547810_1057640584.jpg&refer=http%3A%2F%2Fcbu01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655468710&t=b468dd8d637946fdba41219238c99a2f'
  },
  {
    name: 'food2.jpeg',
    url: 'https://img1.baidu.com/it/u=1882889259,4094897464&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800'
  }
])

const dialogImageUrl = ref('')
const imgDialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  imgDialogVisible.value = true
}

// 初始化
const init = () => {
  console.log('发送请求，获取支出列表数据')
  tableData = [
    {
      id: 'n5',
      title: '第五期支出',
      content: '第五期支出内容',
      publishTime: '2022.5.18 19:11',
      pay: '15元',
      imgList: [
        'https://img1.baidu.com/it/u=1882889259,4094897464&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2018%2F018%2F745%2F8678547810_1057640584.jpg&refer=http%3A%2F%2Fcbu01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655468710&t=b468dd8d637946fdba41219238c99a2f'
      ]
    },
    {
      id: 'n4',
      title: '第四期支出',
      content: '第四期支出内容',
      publishTime: '2022.5.18 19:11',
      pay: '15元',
      imgList: [
        'https://img1.baidu.com/it/u=1882889259,4094897464&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2018%2F018%2F745%2F8678547810_1057640584.jpg&refer=http%3A%2F%2Fcbu01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655468710&t=b468dd8d637946fdba41219238c99a2f'
      ]
    },
    {
      id: 'n3',
      title: '第三期支出',
      content: '第三期支出内容',
      publishTime: '2022.5.18 19:11',
      pay: '15元',
      imgList: [
        'https://img1.baidu.com/it/u=1882889259,4094897464&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2018%2F018%2F745%2F8678547810_1057640584.jpg&refer=http%3A%2F%2Fcbu01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655468710&t=b468dd8d637946fdba41219238c99a2f'
      ]
    },
    {
      id: 'n2',
      title: '第二期支出',
      content: '第二期支出内容',
      publishTime: '2022.5.18 19:11',
      pay: '15元',
      imgList: [
        'https://img1.baidu.com/it/u=1882889259,4094897464&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2018%2F018%2F745%2F8678547810_1057640584.jpg&refer=http%3A%2F%2Fcbu01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655468710&t=b468dd8d637946fdba41219238c99a2f'
      ]
    },
    {
      id: 'n1',
      title: '第一期支出',
      content: '第一期支出内容',
      publishTime: '2022.5.18 19:11',
      pay: '15元',
      imgList: [
        'https://img1.baidu.com/it/u=1882889259,4094897464&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=800',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcbu01.alicdn.com%2Fimg%2Fibank%2F2018%2F018%2F745%2F8678547810_1057640584.jpg&refer=http%3A%2F%2Fcbu01.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1655468710&t=b468dd8d637946fdba41219238c99a2f'
      ]
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
    .dialog-imgList {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      img {
        width: 120px;
        height: 120px;
        border-radius: 5px;
        margin: 10px;
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
