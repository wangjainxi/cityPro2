<template>
  <div class="ins-container">
    <!-- 机构管理 -->
    <div class="ins-management">
      <h3>角色管理</h3>
      <span />
      <div class="ins-management-btn">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          @click="addEvent"
        >添加</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary">删除</el-button>
      </div>
    </div>
    <!-- 查询 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="角色编号">
        <el-input v-model="searchForm.id" placeholder="请输入角色编号" />
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="searchForm.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item>
        <el-button plain @click="searchInt">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
      <el-table-column label="选择" width="300">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checkbox" />
        </template>
      </el-table-column>
      <el-table-column label="角色编号">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>

      <el-table-column prop="address" label="角色名称" show-overflow-tooltip width="200">123</el-table-column>
      <el-table-column label="修改">
        <template>
          <el-button type="text">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <div class="page">
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>
    <!-- 添加弹窗 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色编号" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <!-- tab栏切换 -->
        <el-tabs type="border-card">
          <el-tab-pane label="菜单分配">
            <el-tree
              ref="tree"
              :data="OrganizationalChart"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="[5]"
              :props="defaultProps"
              @check-change="handleCheckChange"
            />
          </el-tab-pane>
          <el-tab-pane label="人员分配">人员分配</el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelInstitution">关闭</el-button>
        <el-button type="primary" @click="addInstitution">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { tableData } from '../InsManagement/insManagement_data'
export default {
  name: 'InsManagement',

  data() {
    return {
      // 新建弹窗
      dialogFormVisible: false,
      // 上级选择
      dialogHigthLevelSelect: false,
      // 查询数据
      searchForm: {
        id: null,
        name: ''
      },
      // 表格数据
      tableData,
      // 页面数据
      page: {
        totalPage: null, // 总页数
        currentPage: null, // 当前页数
        pageSize: null // 每页显示个数
      },
      // 弹框标题
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: '新增'
      },
      // 新增机构验证规则
      rules: {
        id: [{ required: true, message: 'id is required', trigger: 'blur' }],
        name: [
          { required: true, message: 'name is required', trigger: 'blur' }
        ],
        tel: [{ required: true, message: 'tel is required', trigger: 'blur' }],
        address: [
          { required: true, message: 'address is required', trigger: 'blur' }
        ],
        postcod: [
          { required: true, message: 'postcod is required', trigger: 'blur' }
        ],
        fax: [{ required: true, message: 'fax is required', trigger: 'blur' }],
        network: [
          { required: true, message: 'network is required', trigger: 'blur' }
        ],
        remark: [
          {
            type: 'date',
            required: true,
            message: 'remark is required',
            trigger: 'blur'
          }
        ]
      },
      // 新增表单数据
      temp: {
        id: null,
        name: null,
        allot: []

      },
      // 菜单分配数据
      OrganizationalChart: [
        {
          id: 1,
          label: '构建维护',
          children: [
            { id: 2, label: '机构管理' },
            { id: 3, label: '角色管理' },
            { id: 4, label: '人员管理' },
            { id: 5, label: '用户管理' },
            { id: 6, label: '用户分组' },
            { id: 7, label: '菜单管理' },
            { id: 8, label: '案件管理' },
            { id: 9, label: '案件类型' },
            { id: 10, label: '视频组管理' },
            { id: 11, label: '视频头管理' },
            { id: 12, label: '问题来源' },
            { id: 1, label: '预警颜色' }
          ]
        }
      ],
      // 属性
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 搜索上级单位关键字
      searchHigthLevel: '上级单位关键字',
      // 选中的上级单位index
      activeIndex: 1
    }
  },
  computed: {},
  created() {},
  methods: {
    // 机构查询
    searchInt() {},
    // 点击添加添加
    addEvent() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    // 点击新增弹框的保存
    addInstitution() {
      // 打印出选中的数组
      console.log(this.$refs.tree.getCheckedNodes())
      this.temp.allot = this.$refs.tree.getCheckedNodes()
      // this.dialogFormVisible = false
    },
    // 点击弹框的取消

    cancelInstitution() {
      this.dialogFormVisible = false
      this.temp = {
        id: null,
        name: null,
        allot: []
      }
    },
    // 菜单分配 选中情况发生变化
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    }

  }
}
</script>
<style lang="scss" scoped>
.ins-container {
  padding: 10px;
  height: 1000px;
}
.ins-management {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 10px;
  border-radius: 8px;
  margin-top: 10px;
  background-color: #bdddff;
  span {
    flex: 1;
  }
  &-btn {
    padding-right: 20px;
  }
}
.demo-form-inline {
  margin-top: 10px;
  // padding: 0 10px;
  button {
    margin-left: 30px;
  }
}
.page {
  width: 100%;
  margin-top: 10px;
  position: relative;
  .el-pagination {
    position: absolute;
    right: 10px;
  }
}
.higthlevel {
  background-color: #ebebeb;
  border: 1px solid #eee;
  width: 320px;
  height: 36px;
  border-radius: 4px;
}

.el-submenu {
  padding-left: 40px;
}
.blue {
  background-color: #e8f4ff;
}
.el-table {
  // border: 1px solid #e8f4ff;
  width: 100%;
  text-align: center;
  padding-right: 100px;
}
</style>

