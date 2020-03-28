<template>
  <div class="user-container">
    <!-- 用户管理 -->
    <table-header @addEvent="addUser">用户管理</table-header>
    <!-- 查询 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="人员姓名">
        <el-input v-model="searchForm.name" placeholder="请输入人员姓名" />
      </el-form-item>
      <el-form-item label="所属角色">
        <el-input v-model="searchForm.role" placeholder="请输入所属角色" />
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
      <el-table-column label="用户名" width="120">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="人员姓名">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="所属角色">
        <el-button type="text">角色查看</el-button>
      </el-table-column>
      <el-table-column label="PDA号码">
        <template slot-scope="scope">{{ scope.row.PDA }}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{ scope.row.status? '在线':'离线' }}</template>
      </el-table-column>

      <el-table-column label="修改">
        <template>
          <el-button type="text" @click="updateUser">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增、修改弹层 -->
    <el-dialog width="80%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 100%;"
      >
        <div class="form">
          <div class="form-l">
            <el-form-item label="人员姓名：" prop="username">
              <el-input v-model="temp.username" />
            </el-form-item>
            <el-form-item label="用 户 名：" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="用户密码：" prop="password">
              <el-input v-model="temp.password" />
            </el-form-item>
            <el-form-item label="用户角色：">
              <el-button v-model="temp.useroll" round>查看关联角色</el-button>
            </el-form-item>
            <el-form-item label="PDA号码：" prop="PDA">
              <el-input v-model="temp.PDA" />
            </el-form-item>
            <el-form-item label="性   别" prop="sex">
              <el-radio-group v-model="temp.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所属机构">
              <div
                type="text"
                style="text-align:center;"
                class="higthlevel"
                @click="selectHigthLevel"
              >{{ temp.higthlevel }}</div>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="temp.email" />
            </el-form-item>
            <el-form-item label="身份证号" prop="userid">
              <el-input v-model="temp.userid" />
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="temp.tel" />
            </el-form-item>
          </div>
          <div class="form-r">
            <el-form-item label="人员照片：" prop="imageUrl">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="true"
                :before-upload="beforeAvatarUpload"
                :file-list="fileList"
                :on-change="handleChange"
              >
                <img v-if="temp.imageUrl" :src="temp.imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-form-item label="手 机 号：" prop="phone">
              <el-input v-model="temp.phone" />
            </el-form-item>
            <el-form-item label="邮   编" prop="postcod">
              <el-input v-model="temp.postcod" />
            </el-form-item>
            <el-form-item label="所住地址" prop="address">
              <el-input v-model="temp.address" />
            </el-form-item>

            <el-form-item label="描述" prop="remark">
              <el-input
                v-model="temp.remark"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="Please input"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelInstitution">取消</el-button>
        <el-button type="primary" @click="addInstitution">确定</el-button>
      </div>
    </el-dialog>

    <!-- 所属机构 -->
    <el-dialog :visible.sync="dialogHigthLevelSelect">

      <!-- 上级单位 -->

      <el-tree :data="OrganizationalChart" :props="defaultProps" @node-click="handleNodeClick" />
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogHigthLevelSelect= false">取消</el-button> -->
        <el-button type="primary" @click="dialogHigthLevelSelect= false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      // 新增、修改弹层
      dialogFormVisible: false,
      // 所属机构
      dialogHigthLevelSelect: false,
      // // 弹框标题
      dialogStatus: '',
      textMap: {
        update: '修改用户',
        create: '新增用户'
      },
      searchForm: {
        username: '',
        name: '',
        role: ''
      },
      tableData: [
        {
          checkbox: true,
          username: 'aaa',
          name: '值班长',
          role: '',
          PDA: 2412424,
          status: true
        },
        {
          checkbox: false,
          username: 'aaa',
          name: '刘美丽',
          role: '',
          PDA: 121212,
          status: false
        },
        {
          checkbox: false,
          username: 'aaa',
          name: '专业部门',
          role: '',
          PDA: 2121244,
          status: false
        },
        {
          checkbox: false,
          username: 'ccc',
          name: '监督员',
          role: '',
          PDA: 32234234,
          status: false
        },
        {
          checkbox: false,
          username: 'aaa',
          name: '专业部门',
          role: '',
          PDA: 3242342,
          status: false
        },
        {
          checkbox: false,
          username: 'aaa',
          name: '值班长',
          role: '',
          PDA: 3424,
          status: false
        },
        {
          checkbox: false,
          username: 'asdsada',
          name: '值班长',
          role: '',
          PDA: 453,
          status: false
        },
        {
          checkbox: false,
          username: 'sdas',
          name: '环卫刘丽',
          role: '',
          PDA: 3434,
          status: false
        },
        {
          checkbox: false,
          username: 'aaa',
          name: '城管局',
          role: '',
          PDA: 23242,
          status: false
        },
        {
          checkbox: false,
          username: 'aaa',
          name: '城管局',
          role: '',
          PDA: 3242,
          status: false
        }
      ],
      // 新增表单数据
      temp: {
        username: null,
        name: null,
        password: null,
        useroll: [],
        PDA: null,
        sex: 1,
        higthlevel: '',
        email: 'xxx@xx.com',
        userid: '',
        tel: 13911111111,
        imageUrl: '',
        phone: '',
        address: '',
        postcod: '',
        remark: '',
        filter: ''
      },
      // 组织机构数据
      OrganizationalChart: [
        {
          name: '组织机构',
          index: '1',
          children: [
            { name: '忻州经济技术建设环境保护...', children: '', index: '1-1' },
            { name: '忻州经济技术环卫队...', children: '', index: '1-2' },
            {
              index: '1-3',
              name: '忻州经济技术综合监察大队、开发区...',
              children: [
                { name: '孩子1', index: '1-3-1' },
                { name: '孩子2', index: '1-3-2' }
              ]
            },
            { name: '市建设局总办', children: '', index: '1-4' },
            { name: '建管科', children: '', index: '1-5' },
            {
              name: '安全站',
              index: '1-6',
              children: [
                { name: '孩子1', index: '1-6-1' },
                { name: '孩子2', index: '1-6-2' }
              ]
            },
            { name: '招标局', children: '', index: '1-7' },
            { name: '工程质量监督站...', children: '', index: '1-8' },
            { name: '市城建监察支队', children: '', index: '1-9' },
            { name: '市人民公园', children: '', index: '1-10' }
          ]
        }
      ],
      // 属性
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 选中的上级单位index
      activeIndex: 1,
      fileList: []
    }
  },
  methods: {
    searchInt() {
      const { username, name } = this.searchForm
      const searchtable = this.tableData.filter(item => {
        if (item.username === username || item.name === name) {
          return item
        }
      })
      this.tableData = searchtable
    },
    // 新增用户
    addUser() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // alert('用户新增')
    },
    // 修改用户
    updateUser() {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    // 点击选择上级单位
    selectHigthLevel() {
      this.dialogHigthLevelSelect = true
    },
    // 上传图片
    // handleAvatarSuccess(res, file) {
    //   this.temp.imageUrl = URL.createObjectURL(file.raw)
    //   // console.log(this.temp.imageUrl)
    // },
    beforeAvatarUpload(file) {
      console.log(file)

      const isJPG = file.type === 'image/jpeg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/jpeg 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 取消修改或新增
    cancelInstitution() {
      this.dialogFormVisible = false
      this.temp = {
        username: null,
        name: null,
        password: null,
        useroll: [],
        PAD: null,
        sex: 1,
        higthlevel: '',
        email: 'xxx@xx.com',
        userid: '',
        tel: 13911111111,
        imageUrl: '',
        phone: '',
        address: '',
        postcod: '',
        remark: '',
        filter: ''
      }
    },
    // 点击修改或新增的确定
    addInstitution() {
      if (this.dialogStatus === 'create') {
        // 新增
        const { username, name, role, PDA } = this.temp
        console.log(PDA)

        const newData = {
          checkbox: true,
          username,
          name,
          role,
          PDA,
          status: true
        }
        this.tableData.unshift(newData)
      }
      this.dialogFormVisible = false
    },
    handleNodeClick(data) {
      // console.log(data)

      this.temp.higthlevel = data.name
    },
    handleChange(file, fileList) {
      // console.log(file)
      if (file) {
        if (this.beforeAvatarUpload(file)) {
          this.fileList = fileList.slice(-1)
          this.temp.imageUrl = URL.createObjectURL(file.raw)
        }
      }
    }
  }
}
</script>

 <style lang="scss" scoped>
.user-container {
  padding: 10px 30px;
}
.demo-form-inline {
  margin-top: 20px;
}
.el-table {
  border: 1px solid #dfe6ec;
  border-radius: 8px;
}
.form {
  width: 100%;
  display: flex;
  // flex-direction: column;
  padding: 10px;

  &-l {
    flex: 1;
    padding-right: 40px;
  }
  &-r {
    flex: 1;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 112px;
  height: 160px;
  line-height: 160px;
  text-align: center;
  border: 1px solid #8c939d;
}
.avatar {
  width: 112px;
  height: 160px;
  display: block;
}
</style>

