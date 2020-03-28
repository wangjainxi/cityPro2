<template>
  <div class="menu-management">
    <!-- 菜单管理 -->
    <table-header @addEvent="addMeun">菜单管理</table-header>
    <!-- 查询 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="菜单编号">
        <el-input v-model="searchForm.id" placeholder="请输入人员姓名" />
      </el-form-item>
      <el-form-item label="菜单姓名">
        <el-input v-model="searchForm.name" placeholder="请输入人员姓名" />
      </el-form-item>
      <el-form-item>
        <el-button plain @click="searchInt">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;">
      <el-table-column label="选择" width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checkbox" />
        </template>
      </el-table-column>
      <el-table-column label="菜单编号">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="菜单名称">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="父菜单">
        <template slot-scope="scope">{{ scope.row.father }}</template>
      </el-table-column>
      <el-table-column label="菜单链接">
        <template slot-scope="scope">{{ scope.row.menulink }}</template>
      </el-table-column>
      <el-table-column label="图片链接" width="300">
        <template slot-scope="scope">{{ scope.row.imglink }}</template>
      </el-table-column>

      <el-table-column label="修改">
        <template slot-scope="scope">
          <el-button type="text" @click="updateMenu(scope.row,scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 页码 -->
    <div class="page">
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>
    <!-- 新增、修改弹层 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" size="mini">
        <el-form-item label="菜单名称：" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="排 序 值" prop="sort">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item label="菜单链接" prop="menulink">
          <el-input v-model="temp.menulink" />
          <el-button>选取菜单</el-button>
        </el-form-item>
        <el-form-item label="选取图片" prop="imglink">
          <el-upload
            :before-upload="beforeUpload"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-success="uploading"
            multiple
            :limit="1"
            :show-file-list="false"
          >
            <el-input v-model="temp.imglink" />
            <el-button
              v-loading="loading"
              element-loading-spinner="el-icon-loading"
            >选取图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="上级菜单" prop="father">
          <el-input v-model="temp.father" />
          <el-button>上级菜单</el-button>
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
      // 查询数据
      searchForm: {
        id: '',
        name: ''
      },
      // 新增、修改弹层
      dialogFormVisible: false,

      // // 弹框标题
      dialogStatus: '',
      textMap: {
        update: '修改菜单',
        create: '新增菜单'
      },
      // 表格数据
      tableData: [
        {
          checkbox: true,
          id: 'admin',
          name: '构建维护',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        },
        {
          checkbox: true,
          id: 'departmentadmin',
          name: '机构管理',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        },
        {
          checkbox: true,
          id: 'groupadmin',
          name: '角色管理',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        },
        {
          checkbox: true,
          id: 'personAdmin',
          name: '人员管理',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        },
        {
          checkbox: true,
          id: 'userAdmin',
          name: '用户管理',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        },
        {
          checkbox: true,
          id: 'MsgUserGroup',
          name: '用户分组',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        },
        {
          checkbox: true,
          id: 'menuAdmin',
          name: '菜单管理',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        },
        {
          checkbox: true,
          id: 'archiveAdmin',
          name: '案件管理',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        },
        {
          checkbox: true,
          id: 'archivetype',
          name: '案件类型',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        },
        {
          checkbox: true,
          id: 'menu——videolook',
          name: '视频组管理',
          father: 'admin',
          menulink: 'wwwwwwwwwwww',
          imglink: ''
        }
      ],
      // 新增弹框数据
      temp: {
        name: '',
        sort: '',
        menulink: '',
        imglink: '',
        father: ''
      },
      // 加载状态
      loading: false,
      updateindex: 0
    }
  },
  methods: {
    addMeun() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // alert('用户新增')
    },
    updateMenu(item, index) {
      console.log(index)
      this.updateindex = index
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // alert('用户新增')
      this.temp = {
        name: item.name,
        sort: index + 1,
        menulink: item.menulink,
        imglink: item.imglink,
        father: item.father
      }
    },
    beforeUpload(file) {
      console.log(file)

      alert(1)
      this.loading = true
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        this.loading = false
        return
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.loading = false
        return
      }
      return isJPG && isLt2M
    },
    // 上传图片
    uploading(response, file, fileList) {
      console.log(file, fileList)
      this.temp.imglink = file.name
      this.loading = false
    },
    // searchInt 查询方法
    searchInt() {
      const { id, name } = this.searchForm
      const searchtable = this.tableData.filter(item => {
        if (item.id === id || item.name === name) {
          return item
        }
      })
      this.tableData = searchtable
    },
    // 弹层确定
    add() {
      const { name, menulink, imglink, father } = this.temp
      const newdata = {
        checkbox: true,
        id: this.tableData[this.updateindex].id || 'newdata',
        name,
        father,
        menulink,
        imglink
      }

      if (this.dialogStatus === 'create') {
        this.tableData.unshift(newdata)
        this.temp = {
          name: '',
          sort: '',
          menulink: '',
          imglink: '',
          higherMenu: ''
        }
      } else {
        this.tableData.splice(this.updateindex, 1, newdata)
      }
      this.$nextTick(() => {
        this.dialogFormVisible = false
      })
    },
    cancel() {
      this.dialogFormVisible = false
      this.temp = {
        name: '',
        sort: '',
        menulink: '',
        imglink: '',
        higherMenu: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-management {
  padding: 10px 10px;
}
.el-table {
  border: 1px solid #dfe6ec;
  border-radius: 8px;
}
.table-header {
  margin-bottom: 10px;
}
/deep/.el-table thead th {
  background: #b9dbff;
}
.el-input {
  width: 200px;
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
</style>
