<template>
  <div class="music-list">
    <!-- 返回 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- 标题 -->
    <h1 v-html="title" class="title"></h1>
    <!-- 歌手图片 -->
    <div ref="bgImage" :style="bgStyle" class="bg-image">
      <div class="play-wrapper">
        <div
          v-show="songs.length>0"
          ref="playBtn"
          class="play"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div ref="filter" class="filter"></div>
    </div>
    <!-- 歌曲列表随动遮罩 -->
    <div ref="layer" class="bg-layer"></div>
    <!-- 歌曲列表 -->
    <scroll
      @scroll="scroll"
      :data="songs"
      :probe-type="3"
      listen-scroll
      ref="list"
      class="list"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs" />
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
import Scroll from '@/base/Scroll'
import SongList from '@/base/SongList'
import Loading from '@/base/Loading'
import { prefixStyle } from '@/utils/dom'
import { mapActions } from 'vuex'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  name: 'MusicList',
  components: {
    SongList,
    Scroll,
    Loading
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
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
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  watch: {
    scrollY (newVal) {
      const translateY = Math.max(this.minTranslateY, newVal)
      let scale = 1
      let zIndex = 0
      let blur = 0
      const percent = Math.abs(newVal / this.imageHeight)

      if (newVal > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20, percent * 20)
      }

      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      if (newVal < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  methods: {
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    back () {
      this.$router.back()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  }
}
</script>

<style rel='stylesheet/less' lang='less' scoped>
.music-list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: @color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      color: @color-theme;
      font-size: @font-size-large-x;
      padding: 10px;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-align: center;
    line-height: 40px;
    font-size: @font-size-large;
    color: @color-text;
    .no-wrap();
  }
  .bg-image {
    position: relative;
    transform-origin: top;
    width: 100%;
    height: 0;
    padding-top: 70%;
    background-size: cover;
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
    }
    .play {
      width: 135px;
      text-align: center;
      font-size: 0;
      color: @color-theme;
      box-sizing: border-box;
      padding: 7px 0;
      margin: 0 auto;
      border: 1px solid @color-theme;
      border-radius: 100px;
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        font-size: @font-size-medium-x;
        margin-right: 6px;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: @font-size-small;
      }
    }
    .filter {
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .bg-layer {
    height: 100%;
    background: @color-background;
    position: relative;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    // overflow: hidden;
    width: 100%;
    background: @color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-container {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
