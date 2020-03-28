<template>
  <section class="nb-pagination-wrapper">
    <div class="box arrow act" :class="{ disabled: pageno <= 1 }" @click="back">
      <span class="el-icon-arrow-left" />
    </div>
    <div class="show-page">{{ pageno }}</div>
    <div
      class="box arrow act"
      :class="{ disabled: !hasNext }"
      @click="forward"
    >
      <span class="el-icon-arrow-right" />
    </div>
    <div class="ipt-box box">
      <el-input v-model="jump" placeholder="输入" />
    </div>
    <div class="box jump act" @click="jumpClick">跳转</div>
  </section>
</template>

<script>
export default {
  props: {
    hasNext: {
      type: Boolean,
      required: true
    },
    pageSize: {
      type: [String, Number]
    },
    pageNo: [String, Number],
    fetch: Function,
    model: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      pagesize: this.pageSize || this.model.pageSize,
      pageno: this.pageNo || this.model.pageNo,
      jump: '',
      testJump: /^([1-9][0-9]*)$/,
      totals: this.total
    };
  },
  watch: {
    pageSize (val) {
      this.pagesize = val;
    },
    pageNo (val) {
      this.pageno = val;
    },
    model (val) {
      this.pagesize = val.pageSize;
      this.pageno = val.pageNo;
    },
    total (val) {
      this.totals = val;
    }
  },
  mounted () {
  },
  methods: {
    back () {
      if (this.pageno <= 1) return;
      this.pageno = parseInt(this.pageno);
      this.pageno -= 1;
      this.$emit('change', this.pageno);
      this.model.pageNo = this.pageno;
      this.fetch && this.fetch();
    },
    forward () {
      if (!this.hasNext) return;
      this.pageno = parseInt(this.pageno);
      this.pageno += 1;
      this.$emit('change', this.pageno);
      this.model.pageNo = this.pageno;
      this.fetch && this.fetch();
    },
    jumpClick () {
      if (!this.testJump.test(this.jump)) {
        this.jump = '';
        return;
      }
      this.pageno = this.jump >= this.page ? this.page : this.jump <= 1 ? 1 : this.jump;
      this.$emit('change', this.pageno);
      this.model.pageNo = this.pageno;
      this.fetch && this.fetch();
      this.jump = '';
    },
    changeSize (val) {
      this.$emit('change', val, true);
      this.model.pageSize = val;
      this.model.pageNo = 1;
      this.pageno = 1;
      this.fetch && this.fetch();
    },
    resetPagination () {
      this.pageno = 1;
      this.model.pageNo = 1;
      this.totals = 0;
    }
  }
};
</script>

<style lang="scss">
.nb-pagination-wrapper {
  height: 60px;
  display: flex;
  align-items: center;
  /*justify-content: flex-end;*/
  padding: 0 20px;
  background: white;
  .show {
    color: #999;
    font-size: 14px;
  }
  .box {
    border-radius: 2px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #e5e5e5;
    font-size: 14px;
    padding: 0 10px;
  }
  .jump {
    color: #999;
    cursor: pointer;
  }
  .arrow {
    width: 28px;
    padding: 0;
    text-align: center;
    cursor: pointer;
    margin: 0 10px;
    span {
      color: #999;
    }
  }
  .arrow.disabled {
    cursor: not-allowed;
  }
  .act:active {
    background: #fafafa;
  }
  .show-page {
    background: #3497ff;
    border: 1px solid #3497ff;
    width: 28px;
    height: 28px;
    border-radius: 2px;
    color: white;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
  }
  .ipt-box {
    padding: 0;
    margin-right: 10px;
    .el-input {
      width: 50px;
      height: 28px;
      border: none;
      .el-input__inner {
        height: 23px;
        border: none;
        padding: 0;
        text-align: center;
        font-size: 14px;
        color: #c3c3c3;
      }
    }
  }
  .el-select {
    margin: 0 20px;
    .el-input {
      width: 50px;
      .el-input__inner {
        padding: 0;
        border: 1px solid #e5e5e5;
        height: 23px;
        color: #999;
        border-radius: 2px;
        text-indent: 10px;
      }
      .el-input__suffix {
        right: 0;
      }
    }
  }
}
.el-select-dropdown {
  max-width: inherit !important;
}
</style>
