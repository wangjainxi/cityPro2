<template>
  <div class="workflow">
    <!-- 工作流定义 -->
    <table-header @addEvent="addWork" @deleteEvent="deleteWork">流程管理</table-header>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;">
      <el-table-column label="选择" width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checkbox" />
        </template>
      </el-table-column>

      <el-table-column label="流程姓名">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="流程描述">
        <template slot-scope="scope">{{ scope.row.descript }}</template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template
          slot-scope="scope"
        >{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="text" @click="updateWork(scope.row,scope.$index)">修改</el-button>
        </template>
      </el-table-column>

      <el-table-column>
        <template>
          <el-button type="text" @click="$router.push({ path:'/workflow/design' })">设计</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增、修改弹层 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" size="mini">
        <el-form-item label="流程名称：" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="流程描述" prop="remark">
          <el-input
            v-model="temp.remark"
            :rows="4"
            resize="none"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { parseTime } from '@/utils'
export default {
  data() {
    return {
      tableData: [
        {
          checkbox: true,
          name: '案件处理流程',
          descript: '案件处理流程',
          updateTime: new Date()
        }
      ],
      // // 弹框标题
      dialogStatus: '',
      textMap: {
        update: '修改流程--案件处理流程',
        create: '新增流程--案件处理流程'
      },
      dialogFormVisible: false,
      temp: {
        name: '',
        remark: ''
      },
      // 修改数据索引
      updateIndex: 0
    }
  },
  methods: {
    // 新增流程
    addWork() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 删除
    deleteWork() {
      this.$confirm('确认删除选中的工作流？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          const newDate = this.tableData.filter(item => {
            if (!item.checkbox) {
              return item
            }
          })
          console.log(newDate)
          this.tableData = newDate
          this.$message({
            type: 'info',
            message: '已删除'
          })
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改流程
    updateWork(item, index) {
      console.log(index)
      this.updateIndex = index

      this.dialogFormVisible = true
      this.dialogStatus = 'update'
    },

    // 弹框取消
    cancel() {
      this.dialogFormVisible = false
      this.temp = {
        name: '',
        remark: ''
      }
    },
    // 弹框确定
    add() {
      const { name, remark } = this.temp
      const newData = {
        checkbox: false,
        name,
        descript: remark,
        updateTime: new Date()
      }
      if (this.dialogStatus === 'create') {
        // 新增
        this.tableData.unshift(newData)
      } else {
        // 修改
        this.tableData.splice(this.updateIndex, 1, newData)
      }
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .workflow{
    padding : 10px;
  }
</style>
