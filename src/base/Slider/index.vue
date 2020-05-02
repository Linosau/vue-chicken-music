<template>
  <div ref="slider" class="slider">
    <div ref="sliderGroup" class="slider-group">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        :class="{active: currentPageIndex === index}"
        v-for="(item, index) in dots"
        :key="index"
        class="dot"
      ></span>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import { addClass } from '@/utils/dom'
import BScroll from 'better-scroll'

export default {
  name: 'Slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  methods: {
    refresh () {
      if (this.slider) {
        this._setSliderWidth(true)
        this.slider.refresh()
      }
    },
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let chlid = this.children[i]
        addClass(chlid, 'slider-item')

        chlid.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) {
        width += sliderWidth * 2
      }

      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      this.slider.on('scrollEnd', this._onScrollEnd)

      // this.slider.on('touchEnd', () => {
      //   console.log(111)
      //   if (this.autoPlay) {
      //     this._play()
      //   }
      // })

      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _onScrollEnd () {
      const pageIndex = this.slider.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    _play () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider || !this.slider.enabled) {
        return
      }

      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.slider.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.autoPlay) {
            this._play()
          }
        }
        this.refresh()
      }, 60)
    })
  },
  activated () {
    this.slider.enable()

    // const pageIndex = this.slider.getCurrentPage().pageX
    // this.slider.goToPage(pageIndex, 0, 0)
    // this.currentPageIndex = pageIndex

    if (this.autoPlay) {
      this._play()
    }
  },
  deactivated () {
    this.slider.disable()
    clearTimeout(this.timer)
  },
  beforeDestroy () {
    this.slider.disable()
    clearTimeout(this.timer)
  }
}
</script>

<style rel='stylesheet/less' lang='less' scoped>
.slider {
  min-height: 1px;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
  }
  .slider-item {
    float: left;
    text-align: center;
    box-sizing: border-box;
    overflow: hidden;
    & > a {
      display: block;
      width: 100%;
      text-decoration: none;
      overflow: hidden;
    }
    img {
      display: block;
      width: 100%;
    }
  }
  .dots {
    font-size: 0;
    text-align: center;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    .dot {
      display: inline-block;
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
}
</style>
