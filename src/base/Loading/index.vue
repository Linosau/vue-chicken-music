<template>
  <div class="loading">
    <img width="24" height="24" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style rel="stylesheet/less" lang="less" scoped>
.loading{
  width: 100%;
  text-align: center;
  .desc {
    color: @color-text-l;
    font-size: @font-size-small;
    line-height: 20px;
  }
}
</style>
