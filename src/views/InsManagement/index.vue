<template>
  <div class="ins-container">
    <!-- 机构管理 -->
    <div class="ins-management">
      <h3>机构管理</h3>
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
      <el-form-item label="机构编号">
        <el-input v-model="searchForm.id" placeholder="请输入机构编号" />
      </el-form-item>
      <el-form-item label="机构名称">
        <el-input v-model="searchForm.name" placeholder="请输入机构名称" />
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
      <el-table-column label="机构编号" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>

      <el-table-column prop="address" label="机构名称" show-overflow-tooltip>123</el-table-column>
      <el-table-column prop="name" label="机构类型" width="120">123</el-table-column>
      <el-table-column label="上级单位" width="120">123</el-table-column>
      <el-table-column label="联系电话" width="120">123</el-table-column>
      <el-table-column label="修改" width="120">
        <template>
          <el-button type="text">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="120">
        <template>
          <el-button type="text">设置</el-button>
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
        <el-form-item label="机构编号" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="机构类型" prop="statu">
          <el-select v-model="temp.statu" class="filter-item" placeholder="Please select">
            <el-option v-for="item in temp.status" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级单位">
          <div type="text" style="text-align:center;" class="higthlevel" @click="selectHigthLevel">{{ temp.higthlevel }}</div>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="temp.tel" />
        </el-form-item>
        <el-form-item label="机构地址" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item label="邮   编" prop="postcod">
          <el-input v-model="temp.postcod" />
        </el-form-item>
        <el-form-item label="传   真" prop="fax">
          <el-input v-model="temp.fax" />
        </el-form-item>
        <el-form-item label="网   站" prop="network">
          <el-input v-model="temp.network" />
        </el-form-item>
        <el-form-item label="行政区域" prop="political">
          <el-input v-model="temp.political" />
        </el-form-item>

        <el-form-item label="描述" prop="remark">
          <el-input
            v-model="temp.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelInstitution">取消</el-button>
        <el-button type="primary" @click="addInstitution">确定</el-button>
      </div>
    </el-dialog>
    <!-- 上级单位弹框 -->
    <el-dialog :visible.sync="dialogHigthLevelSelect">
      <h4>上级单位</h4>
      <el-input
        v-model="searchHigthLevel"
        placeholder="请输入内容"
        style="width: 180px; margin-right:20px; "
      />
      <el-button>查询</el-button>
      <!-- 组织机构菜单 -->
      <!-- <el-menu
        default-active="1-3"
        class="el-menu-vertical-demo insMenu"
        open="1-3-1"
        active-text-color="#2e80f7"
        @select="selectMenu"
        @open="openMenu"
      >
        <el-submenu :index="OrganizationalChart.index">
          <template slot="title">
            <i class="el-icon-circle-plus" />
            <span>{{ OrganizationalChart.name }}</span>
          </template>

          <el-submenu
            v-for="item in OrganizationalChart.children"
            :key="item.index"
            :index="item.index"
            :class=" activeIndex===item.index?'blue':'' "
          >
            <template v-if="item.children" slot="title">
              <i class="el-icon-circle-plus" />
              <span>{{ item.name }}</span>
            </template>
            <template v-else slot="title">
              <i style="opacity:0;" class="el-icon-circle-plus" />
              <span>{{ item.name }}</span>
            </template>
            <template v-if="item.children.length>0">
              <el-menu-item v-for="i in item.children" :key="i.index" :index="i.index">{{ i.name }}</el-menu-item>
            </template>
          </el-submenu>
        </el-submenu>
      </el-menu>-->
      <el-tree :data="OrganizationalChart" :props="defaultProps" @node-click="handleNodeClick" />
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogHigthLevelSelect= false">取消</el-button> -->
        <el-button type="primary" @click="dialogHigthLevelSelect= false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { tableData } from './insManagement_data'
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
        statu: '监控指挥中心',
        status: ['监控指挥中心', '专业部门'],
        tel: 13911111111,
        address: '',
        postcod: '',
        fax: '010-486732',
        network: '',
        political: '',
        remark: '',
        higthlevel: ''
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
    // 点击选择上级单位
    selectHigthLevel() {
      this.dialogHigthLevelSelect = true
    },
    // 上级单选菜单激活的回调
    // selectMenu(index) {
    //   // alert(index)
    //   console.log(index)
    //   if (index) this.activeIndex = index
    // },
    // openMenu(index) {
    //   // alert(index)
    //   console.log(index)
    //   if (index) this.activeIndex = index
    // }
    handleNodeClick(data) {
      // console.log(data)

      this.temp.higthlevel = data.name
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
</style>

