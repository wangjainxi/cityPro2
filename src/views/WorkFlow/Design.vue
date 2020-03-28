<template>
  <div class="lane-management">
    <table-header @addEvent="addWork" @deleteEvent="deleteWork">泳道管理</table-header>
    <div class="search">
      泳道名称：
      <el-input v-model="input" style="width：120px" placeholder="请输入内容" />
      <el-button>查询</el-button>
    </div>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;">
      <el-table-column label="选择" width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checkbox" />
        </template>
      </el-table-column>

      <el-table-column label="泳道姓名">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="关联角色">
        <template slot-scope="scope">{{ scope.row.roll }}</template>
      </el-table-column>
      <el-table-column label="任务分配">
        <template
          slot-scope="scope"
        >{{ scope.row.task }}</template>
      </el-table-column>
      <el-table-column label="流程定义">
        <template slot-scope="scope">{{ scope.row.flow }}</template>
      </el-table-column>
      <el-table-column label="修改">
        <template slot-scope="scope">
          <el-button type="text" @click="updateWork(scope.row,scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" size="mini">
        <el-form-item label="泳道名称：" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="任务分配">
          <el-select v-model="temp.task" placeholder="请选择任务">
            <el-option v-for="item in tasklist" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联角色">
          <el-select v-model="temp.roll" placeholder="请选择关联角色">
            <el-option v-for="item in rolllist" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属流程">
          <el-select v-model="temp.flow" placeholder="请选择所属流程">
            <el-option v-for="item in flowlist" :key="item" :label="item" :value="item" />
          </el-select>
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
export default {
  data() {
    return {
      tableData: [
        { checkbox: false, name: '班长', roll: '值班长', task: new Date(), flow: '案卷处理流程' },
        { checkbox: false, name: '值班员', roll: '值班长', task: new Date(), flow: '案卷处理流程' },
        { checkbox: false, name: '监督员', roll: '监督员', task: new Date(), flow: '案卷处理流程' },
        { checkbox: false, name: '管理员', roll: '管理员', task: new Date(), flow: '案卷处理流程' },
        { checkbox: false, name: '坐席', roll: '坐席员', task: new Date(), flow: '案卷处理流程' },
        { checkbox: false, name: '专业部门', roll: '专业部门', task: new Date(), flow: '案卷处理流程' },
        { checkbox: false, name: '领导', roll: '领导', task: new Date(), flow: '案卷处理流程' },
        { checkbox: false, name: '接线员', roll: '接线员', task: new Date(), flow: '案卷处理流程' }

      ],
      // // 弹框标题
      dialogStatus: '',
      textMap: {
        update: '泳道管理',
        create: '泳道管理'
      },
      dialogFormVisible: false,
      temp: {
        name: '',
        task: '',
        roll: '',
        flow: ''
      },
      // 修改数据索引
      updateIndex: 0,
      tasklist: ['任务一', '任务二', '任务三'],
      rolllist: ['值班员', '值班长', '监督员', '管理员', '坐席员', '专也部门', '领导', '接线员'],
      flowlist: ['案件处理流程', '1', '2']
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
      this.temp = {
        name: item.name,
        task: item.task,
        roll: item.roll,
        flow: item.flow
      }
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
      const { name, roll, task, flow } = this.temp
      const newData = {
        checkbox: false,
        name,
        roll,
        task,
        flow
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
.lane-management {
  padding: 10px;
}
.search {
  margin-top: 20px;
  .el-input {
    width: 180px;
  }
}
</style>
