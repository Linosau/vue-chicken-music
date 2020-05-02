<template>
  <div v-show="playlist.length" class="player">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <section v-show="fullScreen" class="normal-player">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <div class="top">
          <div @click="back" class="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div ref="cdWrapper" class="cd-wrapper">
              <div class="cd">
                <img :src="currentSong.image" :class="cdCls" class="image" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <div class="middle-r">
            <div class="lyric-wrapper">
              <div>
                <p class="text"></p>
              </div>
              <div class="pure-music">
                <p></p>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l"></span>
            <div class="progress-bar-wrapper">
              <progress-bar />
            </div>
            <span class="time time-r"></span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <div :class="disableCls" class="icon i-left">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div :class="disableCls" class="icon i-center">
              <i @click="togglePlaying" :class="playIcon" class="needsclick"></i>
            </div>
            <div :class="disableCls" class="icon i-right">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </section>
    </transition>
    <transition name="mini">
      <section v-show="!fullScreen" @click="open" class="mini-player">
        <div class="icon">
          <div ref="miniWrapper" class="img-wrapper">
            <img ref="miniImage" width="40" height="40" :src="currentSong.image" :class="cdCls" />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <div style="height: 32px;position: relative;" class="progress-circle">
            <i @click.stop="togglePlaying" :class="miniIcon" class="icon-mini"></i>
          </div>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </section>
    </transition>

    <audio ref="audio" @playing="ready" @error="error" @ended="end" @pause="paused" ></audio>
  </div>
</template>

<script type='text/ecmascript-6'>
import ProgressBar from '@/base/ProgressBar'
import animations from 'create-keyframe-animation'
import { mapGetters, mapMutations } from 'vuex'
import { prefixStyle } from '@/utils/dom'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  name: 'Player',
  components: {
    ProgressBar
  },
  data () {
    return {
      songReady: false
    }
  },
  computed: {
    cdCls () {
      return this.playing ? 'play' : ''
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    ...mapGetters([
      'currentIndex',
      'currentSong',
      'fullScreen',
      'playlist',
      'playing'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return
      }
      this.$refs.audio.src = newSong.url
      this.$refs.audio.play()
      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.songReady = true
      }, 5000)
    },
    playing (newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  methods: {
    // 缩放模式
    back () {
      this.setFullScreen(false)
    },
    // 全屏模式
    open () {
      this.setFullScreen(true)
    },
    // 切换歌曲播放暂停
    togglePlaying () {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    end () {

    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
    },
    // 下一首
    next () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    // 上一首
    prev () {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    // onPlaying
    ready () {
      clearTimeout(this.timer)
      this.songReady = true
    },
    paused () {
      this.setPlayingState(false)
    },
    // onError
    error () {
      clearTimeout(this.timer)
      this.songReady = true
    },

    enter (el, done) {
      const { x, y, scale } = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all .4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`

      const timer = setTimeout(done, 400)
      this.$refs.cdWrapper.addEventListener('transitionend', () => {
        clearTimeout(timer)
        done()
      })
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 获取大圆图片和小圆图片圆心的偏移量及缩放大小
    _getPosAndScale () {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom

      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  }
}
</script>

<style rel='stylesheet/less' lang='less' scoped>
.normal-player {
  background: @color-background;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 150;
  .background {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    filter: blur(20px);
  }
  .top {
    margin-bottom: 25px;
    position: relative;
    .back {
      position: absolute;
      left: 6px;
      top: 0;
      z-index: 50;
      .icon-back {
        display: block;
        color: @color-theme;
        font-size: @font-size-large-x;
        padding: 9px;
        transform: rotate(-90deg);
      }
    }
    .title {
      width: 70%;
      color: @color-text;
      font-size: @font-size-large;
      text-align: center;
      line-height: 40px;
      margin: 0 auto;
      .no-wrap();
    }
    .subtitle {
      color: @color-text;
      font-size: @font-size-medium;
      text-align: center;
      line-height: 20px;
    }
  }
  .middle {
    position: fixed;
    top: 80px;
    bottom: 170px;
    width: 100%;
    font-size: 0;
    white-space: nowrap;
    .middle-l {
      position: relative;
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 0;
      padding-top: 80%;
      .cd-wrapper {
        position: absolute;
        left: 10%;
        top: 0;
        width: 80%;
        height: 100%;
        box-sizing: border-box;
        .cd {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          .image {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
          }
          .play {
            animation: rotate 20s linear infinite;
          }
          .pause {
            animation-play-state: paused;
          }
        }
      }
      .playing-lyric-wrapper {
        width: 80%;
        text-align: center;
        margin: 30px auto 0;
        overflow: hidden;
        .playing-lyric {
          height: 20px;
          line-height: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
    .middle-r {
      display: inline-block;
      width: 100%;
      height: 100%;
      vertical-align: top;
      overflow: hidden;
      .lyric-wrapper {
        width: 80%;
        text-align: center;
        margin: 0 auto;
        overflow: hidden;
        .text {
          color: @color-text-l;
          font-size: @font-size-medium;
          line-height: 32px;
          &.current {
            color: @color-text;
          }
        }
      }
    }
  }
  .bottom {
    width: 100%;
    position: absolute;
    bottom: 50px;
    .dot-wrapper {
      font-size: 0;
      text-align: center;
      .dot {
        display: inline-block;
        vertical-align: middle;
        width: 8px;
        height: 8px;
        margin: 0 4px;
        border-radius: 50%;
        background: @color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: @color-text-ll;
        }
      }
    }
    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      padding: 10px 0;
      margin: 0 auto;
      .time {
        flex: 0 0 30px;
        width: 30px;
        color: @color-text;
        font-size: @font-size-small;
        line-height: 30px;
        &.time-l {
          text-align: left;
        }
        &.time-r {
          text-align: right;
        }
      }
      .progress-bar-wrapper {
        flex: 1;
      }
    }
    .operators {
      display: flex;
      align-items: center;
      .icon {
        flex: 1;
        color: @color-theme;
        &.disable {
          color: @color-theme-d;
        }
        i {
          font-size: 30px;
        }
      }
      .i-left {
        text-align: right;
      }
      .i-center {
        text-align: center;
        padding: 0 20px;
        i {
          font-size: 40px;
        }
      }
      .i-right {
        text-align: left;
      }
      .icon-favorite {
        color: @color-sub-theme;
      }
    }
  }
  &.normal-enter-active, &.normal-leave-active {
    transition: all .4s;
    .top, .bottom {
      transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  &.normal-enter, &.normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
}
.mini-player {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  background: @color-highlight-background;
  .icon {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .img-wrapper {
      width: 100%;
      height: 100%;
    }
    img {
      border-radius: 50%;
      &.play {
        animation: rotate 10s linear infinite;
      }
      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .text {
    flex: 1;
    line-height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    .name {
      color: @color-text;
      font-size: @font-size-medium;
      margin-bottom: 2px;
      .no-wrap();
    }
    .desc {
      color: @color-text-d;
      font-size: @font-size-small;
      .no-wrap();
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-play-mini, .icon-pause-mini, .icon-playlist {
      font-size: 30px;
      color: @color-theme-d;
    }
    .icon-mini {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 32px;
    }
  }
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.4s;
  }
  &.mini-enter, &.mini-leave-to {
    opacity: 0;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
