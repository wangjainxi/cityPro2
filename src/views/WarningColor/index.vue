<template>
  <div class="warin-management">
    <table-header @addEvent="addWork" @deleteEvent="deleteWork">预警颜色管理</table-header>
    <div class="search">
      范围编号：
      <el-input v-model="input" style="width：120px" placeholder="请输入编号" />
      <el-button @click="search">查询</el-button>
      <el-button @click="all">全部</el-button>

    </div>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;">
      <el-table-column label="选择" width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checkbox" />
        </template>
      </el-table-column>

      <el-table-column label="范围编号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="最大值">
        <template slot-scope="scope">{{ scope.row.max }}</template>
      </el-table-column>
      <el-table-column label="最小值">
        <template slot-scope="scope">{{ scope.row.min }}</template>
      </el-table-column>
      <el-table-column label="颜色">
        <template
          slot-scope="scope"
        >
          <div :style="{background:scope.row.color.color,width:'60px',height: '40px'}" />
        </template>
      </el-table-column>
      <el-table-column label="流程描述">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column label="修改">
        <template slot-scope="scope">
          <el-button type="text" @click="updatescale(scope.row,scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" size="mini">
        <el-form-item label="范围编号：" prop="name">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="范围类型">
          <el-select v-model="temp.task" placeholder="请选择任务">
            <el-option v-for="item in typelist" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="最 小 值">
          <el-input v-model="temp.max" />
        </el-form-item>
        <el-form-item label="最 大 值">
          <el-input v-model="temp.min" />
        </el-form-item>
        <el-form-item label="颜   色" class="inputP">
          <div class="input">
            <button :style="{background:temp.color.color,width:'40px',height:'20px'}" />
            <span>{{ temp.color.name }}</span>
          </div>
          <el-select v-model="temp.color" placeholder="请选择任务">
            <el-option v-for="item in colorlist" :key="item.color" :label="item.name" :value="item">
              <button :style="{background:item.color,width:'40px',height:'20px'}" />
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
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
export default {
  data() {
    return {
      input: null,
      tableData: [
        { checkbox: false, id: 1, max: 3, min: 0, color: { name: 'Red', color: '#ff0000' }, remark: '立案数较少' },
        { checkbox: false, id: 2, max: 6, min: 4, color: { name: 'Green', color: '#00ff00' }, remark: '立案数较少' },
        { checkbox: false, id: 3, max: 9, min: 7, color: { name: 'Blue', color: '#0000ff' }, remark: '立案数较少' },
        { checkbox: false, id: 4, max: 15, min: 10, color: { name: 'Yellow', color: '#ffff00' }, remark: '立案数较少' },
        { checkbox: false, id: 5, max: 20, min: 16, color: { name: 'purple', color: '#ff00ff' }, remark: '立案数较少' },
        { checkbox: false, id: 6, max: 600, min: 21, color: { name: 'Cyan', color: '#00ffff' }, remark: '立案数较少' }

      ],
      // // 弹框标题
      dialogStatus: '',
      textMap: {
        update: '范围修改',
        create: '范围添加'
      },
      dialogFormVisible: false,
      temp: {
        id: null,
        type: '小',
        max: null,
        min: '',
        color: {
          name: 'Blue',
          color: '#0000ff'
        },
        remark: ''
      },
      // 修改数据索引
      updateIndex: 0,
      colorlist: [
        { name: 'Blue', color: '#0000ff' },
        { name: 'Red', color: '#ff0000' },
        { name: 'Green', color: '#00ff00' },
        { name: 'Yellow', color: '#ffff00' },
        { name: 'purple', color: '#ff00ff' },
        { name: 'Cyan', color: '#00ffff' },
        { name: 'Orange', color: '#f7b940' },
        { name: 'Black', color: '#000000' },
        { name: 'White', color: '#eeeeee' }

      ],
      typelist: ['小', '中', '大', '特大']
    }
  },
  methods: {
    search() {
      const reg = /^[1-9]\d*$/
      if (reg.test(parseInt(this.input))) {
        const newTable = this.tableData.filter((item) => {
          if (item.id === parseInt(this.input)) return item
        })
        this.tableData = newTable
      } else {
        this.$message('请输入正确的范围编号')
      }
    },
    // 全部
    all() {
      this.tableData = [
        { checkbox: false, id: 1, max: 3, min: 0, color: { name: 'Red', color: '#ff0000' }, remark: '立案数较少' },
        { checkbox: false, id: 2, max: 6, min: 4, color: { name: 'Green', color: '#00ff00' }, remark: '立案数较少' },
        { checkbox: false, id: 3, max: 9, min: 7, color: { name: 'Blue', color: '#0000ff' }, remark: '立案数较少' },
        { checkbox: false, id: 4, max: 15, min: 10, color: { name: 'Yellow', color: '#ffff00' }, remark: '立案数较少' },
        { checkbox: false, id: 5, max: 20, min: 16, color: { name: 'purple', color: '#ff00ff' }, remark: '立案数较少' },
        { checkbox: false, id: 6, max: 600, min: 21, color: { name: 'Cyan', color: '#00ffff' }, remark: '立案数较少' }

      ]
    },
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
    updatescale(item, index) {
      console.log(index)
      this.updateIndex = index

      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp = {
        id: item.id,
        type: item.type,
        max: item.max,
        min: item.min,
        color: item.color,
        remark: item.remark
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
      const { id, type, max, min, color, remark } = this.temp
      const newData = {
        checkbox: true,
        id,
        type,
        max,
        min,
        color,
        remark
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
.warin-management {
  padding: 10px;
}
.search {
  margin-top: 20px;
  .el-input {
    width: 180px;
  }
}
.inputP{
  position: relative;
}
  .input{
    position: absolute;
    top:2px;
    left: 10px;
    z-index: 999;
  }

</style>
