<template>
  <el-card class="container">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/article' }">当前模块</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 信息表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="authorName" label="作者"></el-table-column>
      <el-table-column prop="publishTime" label="发布时间"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div class="flex-group">
            <el-tag @click="check(scope.row)" effect="dark" round> 查看 </el-tag>
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
    <!-- 信息对话框 -->
    <el-dialog @closed="closeEditDialog" v-model="editDialog" title="文章内容">
      <div class="content">
        <Editor
          class="content-editor"
          v-if="isEditorShow"
          :editorId="editorId"
          :defaultConfig="{
            readOnly: true
          }"
          :defaultHtml="defaultHtml"
          mode="simple"
          style="width: 100%"
        />
      </div>
      <div class="form_buttons">
        <el-button @click="closeEditDialog" type="primary">确认</el-button>
        <el-button @click="closeEditDialog" type="info">取消</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref, Ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Editor } from '@wangeditor/editor-for-vue'

/* 富文本编辑器初始化 */
const editorId = `w-e-${Math.random().toString().slice(-4)}`
const defaultHtml = ref('<p>loading...</p>')
const isEditorShow = ref(false)

// 分页列表
let tableData: INFO.ArticleData[] = reactive([])
const pagination: Ref<INFO.pagination> = ref({
  pageNum: 1,
  pageSize: 10,
  total: 20
})
const handleCurrentChange = () => {
  console.log('分页请求获取数据列表', pagination.value)
}

// 信息对话框
const editDialog = ref(false)
const closeEditDialog = () => {
  editDialog.value = false
  setTimeout(() => {
    defaultHtml.value = ''
    isEditorShow.value = false
  }, 150)
}

// 表格操作（查看,删除）
const check = (row: INFO.ArticleData) => {
  // 富文本解析器异步获取数据
  defaultHtml.value = row.content
  isEditorShow.value = true
  editDialog.value = true
}
const deleteUser = (row: INFO.ArticleData) => {
  console.log('发送请求删除文章信息', row.articleId)
  console.log('发送请求，重新刷新数据列表')
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}

// 初始化操作
const init = () => {
  console.log('发送请求获取文章列表')
  tableData = [
    {
      articleId: '9999',
      title: '猫咪雪豹受伤情况恢复',
      avatar:
        'https://p26-passport.byteacctimg.com/img/user-avatar/4b9b94b97a7a735e87facbea7cacdcbc~300x300.image',
      authorName: '重邮猫咪小助手',
      publishTime: '2022年5月7日 14:22',
      hitsNum: 50,
      replyNum: 3,
      thumbsUpNum: 2,
      content:
        '<p><img src="https://img2.baidu.com/it/u=3971627457,1973217076&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=402" alt="aa" data-href="https://img2.baidu.com/it/u=3971627457,1973217076&fm=253&fmt=auto&app=138&f=JPEG?w=600&h=402" style=""/></p><p><span style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); font-size: 15px; font-family: punctuation, PingFangSC-Regular, &quot;Microsoft Yahei&quot;, &quot;sans-serif&quot;;">【喵喵解释】老校门的雪豹前段时间和其他猫猫打架受伤，救助中心的同学发现后第一时间将其送往医院救治。救治过程中剃掉了脖子部位的毛发。近期我们将雪豹接回校园，脖子上的伤口因为正在恢复结痂，所以会看起来很恐怖，很多同学也因此很担心雪豹的状况并前来询问</span><img src="http://qzonestyle.gtimg.cn/qzone/em/e10307.gif" alt="" data-href="" style=""/><span style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); font-size: 15px; font-family: punctuation, PingFangSC-Regular, &quot;Microsoft Yahei&quot;, &quot;sans-serif&quot;;">小助手在此感谢各位同学的关心</span><img src="http://qzonestyle.gtimg.cn/qzone/em/e163.png" alt="" data-href="" style=""/><span style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255); font-size: 15px; font-family: punctuation, PingFangSC-Regular, &quot;Microsoft Yahei&quot;, &quot;sans-serif&quot;;">雪豹现在正在逐渐恢复，大家不用太担心啦，欢迎大家多多投喂，也希望雪豹早日恢复健康</span></p>'
    },
    {
      articleId: '9998',
      title: '测试标题',
      avatar:
        'https://p26-passport.byteacctimg.com/img/user-avatar/4b9b94b97a7a735e87facbea7cacdcbc~300x300.image',
      authorName: '测试作者',
      publishTime: '2022年5月1日 14:22',
      hitsNum: 0,
      replyNum: 1,
      thumbsUpNum: 1,
      content:
        '<p><img src="https://img2.baidu.com/it/u=3290807137,2850580728&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" alt="柴犬" data-href="https://img2.baidu.com/it/u=3290807137,2850580728&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" style=""/></p><p>我是大帅哥哈哈哈哈</p>'
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
.form_buttons {
  display: flex;
  justify-content: space-around;
  button {
    width: 100px;
  }
  .el-input {
    width: 70%;
  }
}
.content {
  margin: 20px 10px 50px;
}
</style>
