<template>
  <el-popover v-model="visible" class="el-popover-out" placement="left" width="160">
    <p class="delete-title">{{ title }}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="visible = false">{{
        cancel
      }}</el-button>
      <el-button type="primary" size="mini" @click="onDelete">{{
        confirm
      }}</el-button>
    </div>
    <el-button slot="reference" :size="size" :type="type">{{
      text
    }}</el-button>
  </el-popover>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: '删除'
    },
    placement: {
      type: String,
      default: 'left'
    },
    title: {
      type: String,
      default: '确定要删除吗 ？'
    },
    cancel: {
      type: String,
      default: '取消'
    },
    confirm: {
      type: String,
      default: '删除'
    },
    confirmDelete: {
      type: Function,
      default: () => { }
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'danger'
    }
  },
  data () {
    return {
      visible: false
    };
  },
  methods: {
    onDelete () {
      this.visible = false;
      this.$emit('confirmDelete');
    }
  }
};
</script>
<style  >
.el-popover-out{
  /* margin-left: 10px; */
}
.el-popover-out .delete-title{

    /* margin-top: 20px;
    margin-bottom: 8px; */
  }
</style>
