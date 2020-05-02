<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, index)"
        v-for="(song, index) in songs"
        :key="index"
        class="song-item"
      >
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem (item, index) {
      this.$emit('select', item, index)
    },
    getDesc (song) {
      return `${song.singer}·${song.album}`
    }
  }
}
</script>

<style rel='stylesheet/less' lang='less' scoped>
.song-item {
  display: flex;
  align-items: center;
  height: 64px;
  font-size: @font-size-medium;
  box-sizing: border-box;
  // .rank {
  //   flex: 0 0 25;
  //   width: 25px;
  //   margin-right: 30px;
  //   text-align: center;
  //   .icon {
  //     display: inline-block;
  //     width: 25px;
  //     height: 24px;
  //     background-size: 25px 24px;
  //     &.icon0 {
  //       .bg-image('../../base/Song-list/first')
  //     }
  //     &.icon1 {
  //       .bg-image('../../base/Song-list/second')
  //     }
  //     &.icon2 {
  //       .bg-image('../../base/Song-list/third')
  //     }
  //   }
  //   .text {
  //     color: @color-theme;
  //     font-size: @font-size-large;
  //   }
  // }
  .content {
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .name {
      color: @color-text;
      .no-wrap();
    }
    .desc {
      color: @color-text-d;
      margin-top: 4px;
      .no-wrap();
    }
  }
}
</style>
