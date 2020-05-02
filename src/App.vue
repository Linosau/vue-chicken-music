<template>
  <div id="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view />
    </keep-alive>
    <player />
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from '@/components/Header'
import Tab from '@/components/Tab'
import Player from '@/components/Player'

export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="less">
</style>
