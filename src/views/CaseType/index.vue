<template>
  <div class="case-container">
    <!-- <div -->
    <h3 class="header">案件管理</h3>
    <!-- 树形结构 -->
    <el-tree
      :data="caseType"
      node-key="id"
      :default-expanded-keys="[1,2]"
      :expand-on-click-node="false"
    >
      <!-- <span slot-scope="{ node, data }" class="custom-tree-node">
        <i class="el-icon-folder-opened" />
        <span>{{ node.label }}</span>
      </span>-->
      <span
        slot-scope="{ node, data }"
        class="custom-tree-node"
        @contextmenu.prevent="$refs.menu.open($event, {name:data.label,id:data.id,children:data.children || []})"
      >
        <i v-if="data.children && data.children.length>0" class="el-icon-folder-opened" />
        <i v-else class="el-icon-document" />
        <span>{{ node.label }}</span>
      </span>
    </el-tree>
    <!-- 右击显示的vue-content -->
    <vue-context ref="menu">
      <template v-if="child.data" slot-scope="child">
        <li>
          <span>{{ child }}</span>
          <a @click.prevent="add(child.data)">新建</a>
        </li>
        <li>
          <a @click.prevent="remove(child.data)">删除</a>
        </li>
        <li>
          <a @click.prevent="update(child.data)">修改</a>
        </li>
      </template>
    </vue-context>
    <!-- 弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="first">
          <el-form label-position="left" label-width="80px" :model="temp" :rules="rules">
            <el-form-item label="案例类型编码" prop="code">
              <el-input v-model="temp.code" />
            </el-form-item>
            <el-form-item label="案件类型名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane v-if="dialogStatus==='update'" label="受理时限" name="second">配置管理</el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="Onsubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueContext from 'vue-context'
import 'vue-context/src/sass/vue-context.scss'
export default {
  components: { VueContext },
  data() {
    return {
      dialogFormVisible: false,
      activeName: 'first',
      caseType: [
        { id: 1,
          label: '事件',
          children: [
            { id: 40, label: '市容环境', children: [
              { id: 15, label: '市容环境1-1' },
              { id: 16, label: '市容环境1-2' },
              { id: 17, label: '市容环境1-3' }
            ] },
            { id: 3, label: '宣传广告', children: [
              { id: 18, label: '宣传广告1-1' },
              { id: 19, label: '宣传广告1-2' },
              { id: 20, label: '宣传广告1-3' }
            ] },
            { id: 4, label: '施工管理', children: [
              { id: 21, label: '施工管理1-1' },
              { id: 22, label: '施工管理1-2' },
              { id: 23, label: '施工管理1-3' }
            ] },
            { id: 5, label: '突发事件', children: [
              { id: 24, label: '突发事件-1' },
              { id: 25, label: '突发事件-2' },
              { id: 26, label: '突发事件-3' }
            ] },
            { id: 6, label: '街面秩序', children: [
              { id: 14, label: '扩展事件' }
            ] },
            { id: 7, label: '热线问题', children: [
              { id: 33, label: '热线问题-1' },
              { id: 34, label: '热线问题-2' },
              { id: 35, label: '热线问题-3' }
            ] },
            { id: 8, label: '违法建设类', children: [
              { id: 36, label: '违法建设' }
            ] }
          ]
        },
        { id: 2,
          label: '部件',
          children: [
            { id: 9, label: '公共设施', children: [
              { id: 27, label: '公共设施-1' },
              { id: 28, label: '公共设施-2' },
              { id: 29, label: '公共设施-3' }
            ] },
            { id: 10, label: '道路交通', children: [
              { id: 30, label: '道路交通-1' },
              { id: 31, label: '道路交通-2' },
              { id: 32, label: '道路交通-3' }
            ] },
            { id: 11, label: '市容环境', children: [] },
            { id: 12, label: '园林绿化', children: [] },
            { id: 13, label: '房屋土地', children: [] }
          ]
        }
      ],
      selectDate: {},
      // 弹框标题
      dialogStatus: '',
      textMap: {
        update: '修改案件类型',
        create: '新增案件类型',
        remove: '删除案件类型'
      },
      // 表单数据
      temp: {
        code: 0,
        name: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入案例编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请填写案例名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    add(data) {
      // console.log('selectDate.id', data)

      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.selectDate = data
    },

    remove(data) {
      this.selectDate = data
      this.dialogStatus = 'remove'
      const fatherindex = 0
      const rank = 0
      this.select(this.caseType, fatherindex, rank)
    },
    update(data) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.selectDate = data
      this.temp = {
        code: data.id,
        name: data.name
      }
    },
    cancel() {
      this.dialogFormVisible = false
      this.temp = {
        code: '',
        name: ''
      }
    },
    Onsubmit() {
      // alert(1)
      // console.log(this.selectDate.children)

      const newDate = {
        id: this.temp.code,
        label: this.temp.name,
        children: []
      }
      var rank = 0
      var fatherindex = 0
      if (this.dialogStatus === 'create') {
        // console.log(this.selectDate.id)
        // console.log(this.selectDate.children)

        if (this.selectDate.children.length > 1) {
          this.selectDate.children.push(newDate)
        } else {
          alert(1)
          // 没有children代表最底层
          // console.log(this.caseType[this.zindex])
          this.select(this.caseType, fatherindex, rank)

          // alert(1)
          console.log(rank)
        }
      } else {
        this.select(this.caseType, fatherindex, rank)
        // this.selectDate = newDate
      }
    },
    select(data, fatherindex, rank) {
      console.log(rank)
      rank++
      data.forEach((item, index) => {
        if (item.id === this.selectDate.id) {
          console.log('this.selectDate.id', item.id)

          console.log(data, index, fatherindex, rank)
          alert(1)
          this.fatherNode = data
          this.fatherNodeIndex = fatherindex
          this.NodeIndex = index
          console.log('rank', rank)

          // 删除
          if (this.dialogStatus === 'remove') {
            if (rank === 1) {
              this.$confirm('此操作将删除该类所有案件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.caseType.splice(index, 1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'

                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
            } else if (rank === 2) {
              this.$confirm('此操作将删除该类所有案件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                console.log('二层级', this.caseType[fatherindex])

                this.caseType[fatherindex].children.splice(index, 1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'

                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
            } else if (rank === 3) {
              this.$confirm('此操作将删除该类所有案件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.caseType.forEach((item, i) => {
                  console.log(item, i)

                  item.children.forEach((item) => {
                    if (item.children === data) {
                      this.zindex = i
                      console.log('这是最上层index', i)
                      this.caseType[i].children[fatherindex].children.splice(index, 1)
                    }
                  })
                })
                this.$message({
                  type: 'success',
                  message: '删除成功!'

                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
            }
          } else {
            // 增改

            if (rank === 1) {
              this.$set(this.caseType, this.NodeIndex, { id: this.temp.code, label: this.temp.name, children: this.selectDate.children })
            } else if (rank === 2) {
              console.log(typeof (fatherindex))

              // console.log(this.caseType[])

              this.$set(this.caseType[fatherindex].children, index, { id: this.temp.code, label: this.temp.name, children: this.selectDate.children })
            } else if (rank === 3) {
            // this.caseType[fatherindex].children[index]
              console.log('这是data', data)
              this.caseType.forEach((item, i) => {
                console.log(item, i)

                item.children.forEach((item) => {
                  if (item.children === data) {
                    this.zindex = i
                    console.log('这是最上层index', i)
                    if (this.dialogStatus === 'update') {
                      this.$set(this.caseType[i].children[fatherindex].children, index, { id: this.temp.code, label: this.temp.name, children: this.selectDate.children })
                      return i
                    } else {
                      alert(1)
                      this.caseType[i].children[fatherindex].children.push({ id: this.temp.code, label: this.temp.name, children: this.selectDate.children })
                    }
                  }
                })
              })

            // this.$set(this.caseType[zindex])
            }
            this.dialogFormVisible = false
            this.temp = {
              code: '',
              name: ''
            }
          }
        } else {
          // console.log(item)
          if (item.children && item.children.length > 0) {
            this.select(item.children, index, rank)
          }
        }
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.case-container {
  padding: 10px;
  height: 1000px;
}
.header {
  background-color: #b9dbff;
  line-height: 46px;
  border-radius: 10px;
  padding-left: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: start;
  font-size: 14px;
  padding-right: 8px;
}
</style>
