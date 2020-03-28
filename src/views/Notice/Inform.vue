<template>
  <div class="notice-container">

    <!-- <div -->
    <h3 class="header">公告查看</h3>

    <!-- 查询 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="公告标题:">
        <el-input v-model="searchForm.title" placeholder="请输入机构编号" />
      </el-form-item>
      <el-form-item label="公告名称:">
        <el-input v-model="searchForm.name" placeholder="请输入机构名称" />
      </el-form-item>
      <el-form-item label="开始时间:">

        <el-date-picker
          v-model="searchForm.startdate"
          type="date"
          placeholder="选择日期时间"
        />
        <i class="el-icon-date" />
      </el-form-item>
      <el-form-item label="结束时间:">
        <el-date-picker v-model="searchForm.enddate" type="date" placeholder="选择日期" />
        <i class="el-icon-date" />
      </el-form-item>
      <el-form-item label="查看等级:">
        <el-select v-model="searchForm.grade" placeholder="活动区域">
          <el-option v-for="item in grades" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="searchInt">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;">

      <el-table-column label="公告标题">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column prop="publish" label="发布者">
        <template slot-scope="scope">{{ scope.row.publish }}</template>
      </el-table-column>
      <el-table-column prop="publishdate" label="发布日期">
        <template slot-scope="scope">{{ scope.row.publishdate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</template>
      </el-table-column>
      <el-table-column label="重要等级" prop="roll">
        <template slot-scope="scope">{{ scope.row.roll }}</template>
      </el-table-column>
      <el-table-column label="查看">
        <template slot-scope="scope">
          <el-button type="text" @click="updatenotice(scope.row,scope.$index)">查看</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 页码 -->
    <div class="page">
      <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>

    <!-- 详情弹框 -->
    <el-dialog
      title="文章详情"
      :visible.sync="dialogFormVisible"
      width="60%"
    >
      <div class="detail" style="text-align:center;">
        <h2>{{ tableData[selectIndex].title }}</h2>
        <span>发布者:{{ tableData[selectIndex].publish }}</span>
        <span>重要等级:{{ tableData[selectIndex].roll }}</span>
        <span>发布时间:{{ tableData[selectIndex].publishdate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        <div class="content">
          {{ tableData[selectIndex].desc }}
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
// import { tableData } from './insManagement_data'
export default {
  name: 'InsManagement',

  data() {
    return {
      // 新建弹窗
      dialogFormVisible: false,

      // 查询数据
      searchForm: {
        title: '',
        name: '',
        startdate: null,
        enddate: null,
        grade: '全部'
      },
      // 表格数据
      tableData: [
        { title: '今天是第一', publish: '测试班长', publishdate: new Date(), roll: '3', checkbox: true, desc: '内容.....' },
        { title: '今天是6月26号', publish: 'admin', publishdate: new Date(), roll: '1', checkbox: true, desc: '内容.....' },
        { title: '222', publish: '测试班长', publishdate: new Date(), roll: '2', checkbox: true, desc: '内容.....' },
        { title: '1111', publish: '测试班长', publishdate: new Date(), roll: '1', checkbox: true, desc: '内容.....' },
        { title: '6666', publish: '贾苏', publishdate: new Date(), roll: '3', checkbox: true, desc: '内容.....' },
        { title: '发卷子了', publish: '测试班长', publishdate: new Date(), roll: '3', checkbox: true, desc: '内容.....' },
        { title: '测试的标题', publish: 'admin', publishdate: new Date(), roll: '5', checkbox: true, desc: '内容.....' },
        { title: '不发了', publish: '测试班长', publishdate: new Date(), roll: '2', checkbox: true, desc: '内容.....' },
        { title: '发给电工的公告', publish: '测试班长', publishdate: new Date(), roll: '3', checkbox: true, desc: '内容.....' },
        { title: '今天发卷子了', publish: '测试班长', publishdate: new Date(), roll: '1', checkbox: true, desc: '内容.....' }
      ],
      // 页面数据
      page: {
        totalPage: null, // 总页数
        currentPage: null, // 当前页数
        pageSize: null // 每页显示个数
      },
      // 弹框标题
      dialogStatus: '',
      textMap: {
        update: '修改',
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
        title: '',
        roll: '全部',
        scale: [],
        desc: ''
      },
      // 组织机构数据
      OrganizationalChart: [
        {
          name: '组织机构',
          id: 1,
          children: [
            { name: '忻州经济技术建设环境保护...', children: '', id: 2 },
            { name: '忻州经济技术环卫队...', children: '', id: 3 },
            {
              id: 4,
              name: '忻州经济技术综合监察大队、开发区...',
              children: [
                { name: '孩子1', id: 12 },
                { name: '孩子2', id: 13 }
              ]
            },
            { name: '市建设局总办', children: '', id: 5 },
            { name: '建管科', children: '', id: 6 },
            {
              name: '安全站',
              id: 7,
              children: [
                { name: '孩子1', id: 14 },
                { name: '孩子2', id: 15 }
              ]
            },
            { name: '招标局', children: '', id: 8 },
            { name: '工程质量监督站...', children: '', id: 9 },
            { name: '市城建监察支队', children: '', id: 10 },
            { name: '市人民公园', children: '', id: 11 }
          ]
        }
      ],
      // 属性
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 搜索上级单位关键字
      searchHigthLevel: '上级单位关键字',

      grades: ['全部', '1', '2', '3', '4', '5'],
      // 修改的数据的index
      selectIndex: 0

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
    // 点击修改
    updatenotice(item, index) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.selectIndex = index
      this.temp = {
        title: item.title,
        roll: item.roll,
        desc: item.desc
      }
    },
    // 点击新增弹框的确定
    addInstitution() {
      this.dialogFormVisible = false
    },
    // 点击弹框的取消

    cancelInstitution() {
      this.dialogFormVisible = false
      this.temp = {
        id: null,
        name: null,
        status: '',
        tel: 13911111111,
        address: '',
        postcod: '',
        fax: '010-486732',
        network: '',
        political: '',
        remark: '',
        higthlevel: ''
      }
    },

    // 选中发布范围
    handleNodeClick(data, checknode) {
      alert('1')
      console.log(data)
      console.log('选中组成的对象', checknode)
      this.temp.scale = checknode.checkedNodes

      // this.temp.higthlevel = data.name
    },
    // 点击确定
    onSubmit() {
      const { title, roll, desc } = this.temp
      const newdate = {
        title,
        publish: '测试班长',
        publishdate: new Date(),
        roll,
        checkbox: true,
        desc }

      if (this.defaultProps === 'create') {
        // 新增
        this.tableData.unshift(newdate)
      } else {
        this.tableData.splice(this.selectIndex, 1, newdate)
      }
      this.dialogFormVisible = false
      this.temp = {
        title: '',
        roll: '全部',
        scale: [],
        desc: ''
      }
    },
    // 取消
    cancel() {
      this.dialogFormVisible = false
      this.temp = {
        title: '',
        roll: '全部',
        scale: [],
        desc: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.notice-container {
  padding: 10px;
  height: 1000px;
}
.header{
  background-color: #b9dbff;
  line-height: 46px;
  border-radius: 10px;
  padding-left: 10px;
}
 /deep/.el-table .cell{
   text-align: center;
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
.el-input {
  width: 110px;
}
.el-select{
  width: 80px;
}
// .el-input__inner{
//   width: 150px;
// }
.detail{
  span{
    margin-right: 10px;
    font-size: 16px;
  }
  .content{
    width: 80%;
    height: 400px;
    border: 3px solid #eff1f3;
    margin: 10px auto;
    text-align: left;
    padding: 10px;
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
</style>

