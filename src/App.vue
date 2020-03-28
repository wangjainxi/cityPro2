<template>
  <div id="app">
    <!-- <keep-alive> -->
    <router-view />
    <!-- </keep-alive> -->
  </div>
</template>
<script>
export default {
  mounted() {
    this.$store.dispatch('product/getUnitAction');
  }
};
</script>
