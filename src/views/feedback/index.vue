<template>
  <el-card class="container">
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/feedback' }">当前模块</el-breadcrumb-item>
      <el-breadcrumb-item>反馈和建议</el-breadcrumb-item>
    </el-breadcrumb>
    <el-timeline>
      <el-timeline-item
        v-for="item in tableData"
        :key="item.id"
        :timestamp="item.publishTime"
        placement="top"
      >
        <el-card>
          <div class="suggestion"><img src="../../assets/send.svg" alt="意见箱" />:</div>
          <div class="content">
            {{ item.content }}
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

// 分页列表
let tableData: INFO.Feedback[] = reactive([])

// 初始化
const init = async () => {
  console.log('发送请求，获取反馈建议列表数据')
  tableData = [
    {
      id: 'f1',
      publishTime: '2022.5.1 5:05',
      content: '能不能做好看点啊？我真的栓q'
    },
    {
      id: 'f2',
      publishTime: '2022.5.12 5:05',
      content:
        '希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来希望捐赠明细可以标注出来'
    },
    {
      id: 'f3',
      publishTime: '2022.5.14 5:05',
      content: '有一定卡顿'
    },
    {
      id: 'f4',
      publishTime: '2022.5.15 5:05',
      content: '谢忠豪吃粑粑哈哈哈哈'
    }
  ]
}
init()
</script>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  .el-timeline {
    margin-top: 50px;
  }
  .suggestion {
    display: flex;
    height: 30px;
    align-items: center;
    img {
      width: 25px;
      height: 25px;
    }
  }
  .content {
    padding-left: 40px;
  }
}
</style>
