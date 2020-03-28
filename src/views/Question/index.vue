<template>
  <div class="question-container">
    <table-header @addEvent="addquestion" @deleteEvent="deletequestion">问题来源管理</table-header>

    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;">
      <el-table-column label="选择" width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checkbox" />
        </template>
      </el-table-column>
      <el-table-column label="问题来源编号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="问题来源名称">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="text" @click="updatequestion(scope.row,scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :line="true" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="temp">
        <el-form-item label="问题来源编号" label-width="120">
          <el-input v-model="temp.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="问题来源名称" label-width="120">
          <el-input v-model="temp.name" autocomplete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { checkbox: false, id: 201220629145151, name: '监督员上报' },
        { checkbox: false, id: 1, name: '监督员上报' },
        { checkbox: false, id: 2, name: '网上投诉' },
        { checkbox: false, id: 3, name: '市民来电' },
        { checkbox: false, id: 4, name: '巡查发现' },
        { checkbox: false, id: 5, name: '监控发现' },
        { checkbox: false, id: 6, name: '12345市长热线' }
      ],
      dialogFormVisible: false,
      // // 弹框标题
      dialogStatus: '',
      textMap: {
        update: '修改问题来源',
        create: '新增问题来源'
      },
      // 弹框数据
      temp: {
        id: null,
        name: ''
      },
      selectindex: 0
    }
  },
  methods: {
    // 新增流程
    addquestion() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 删除
    deletequestion() {
      this.$confirm('确认删除选中的问题来源？', '提示', {
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
    updatequestion(data, index) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.selectindex = index
      this.temp = {
        id: data.id,
        name: data.name
      }
    },
    cancel() {
      this.dialogFormVisible = false
      this.temp = {
        id: null,
        name: ''
      }
    },
    onSubmit() {
      const newDate = {
        checkbox: true,
        id: this.temp.id,
        name: this.temp.name
      }
      if (this.dialogStatus === 'create') {
        this.tableData.unshift(newDate)
      } else {
        this.tableData.splice(this.selectindex, 1, newDate)
      }

      this.dialogFormVisible = false
      this.temp = {
        id: null,
        name: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.question-container{
  padding: 10px;
}
</style>
