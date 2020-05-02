<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  name: 'Header'
}
</script>

<style rel='stylesheet/less' lang='less' scoped>
.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  font-size: 0px;
  color: @color-theme;
  .icon {
    display: inline-block;
    vertical-align: top;
    width: 30px;
    height: 32px;
    margin: 6px 9px 0 0;
    .bg-img('images/logo');
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    font-size: @font-size-large;
    line-height: 44px;
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      color: @color-theme;
      font-size: 20px;
      padding: 12px;
    }
  }
}
</style>
