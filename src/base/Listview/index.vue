<template>
  <scroll
    @scroll="scroll"
    :data="data"
    :probe-type="3"
    listen-scroll
    ref="listview"
    class="listview"
  >
    <ul>
      <li
        v-for="group in data"
        :key="group.title"
        ref="listGroup"
        class="list-group"
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            @click="selectItem(item)"
            v-for="item in group.items"
            :key="item.id"
            class="list-group-item"
          >
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop
      class="list-shortcut"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          :data-index="index"
          :class="{'current': currentIndex === index}"
          class="item"
        >{{item}}</li>
      </ul>
    </div>
    <div v-show="fixedTitle" ref="fixed" class="list-fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </scroll>
</template>

<script type='text/ecmascript-6'>
import Scroll from '@/base/Scroll'
import { getData } from '@/utils/dom'

const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  name: 'Listview',
  components: {
    Scroll
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentIndex: 0,
      scrollY: -1, // 滚动纵轴位置
      diff: -1
    }
  },
  computed: {
    shortcutList () {
      return this.data.map(group => group.title.substr(0, 1))
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        const height1 = listHeight[i]
        const height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      const fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart (e) {
      const anchorIndex = getData(e.target, 'index')
      this.touch.y1 = e.touches[0].pageY
      this.touch.anchorIndex = anchorIndex

      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      this.touch.y2 = e.touches[0].pageY
      const delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      const anchorIndex = parseInt(this.touch.anchorIndex) + delta

      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    // 计算歌手列表每个group所在的高度
    _calculateHeight () {
      let height = 0
      this.listHeight = this.$refs.listGroup.reduce((arr, item) => {
        height += item.clientHeight
        return arr.concat(height)
      }, [height])
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }

      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      this.scrollY = this.$refs.listview.scroll.y
    }
  },
  created () {
    this.touch = {}
    this.listHeight = []
  }
}
</script>

<style rel='stylesheet/less' lang='less' scoped>
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  background: @color-background;
  overflow: hidden;
}
.list-group {
  padding-bottom: 30px;
  .list-group-title {
    height: 30px;
    line-height: 30px;
    color: @color-text-l;
    font-size: @font-size-small;
    padding-left: 20px;
    background: @color-highlight-background;
  }
  .list-group-item {
    display: flex;
    align-items: center;
    padding: 20px 0 0 30px;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .name {
      color: @color-text-l;
      font-size: @font-size-medium;
      margin-left: 20px;
    }
  }
}
.list-shortcut {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 30;
  width: 20px;
  font-family: Helvetica;
  text-align: center;
  padding: 20px 0;
  border-radius: 10px;
  background: @color-background-d;
  .item {
    color: @color-text-l;
    font-size: @font-size-small;
    line-height: 1;
    padding: 3px;
    &.current {
      color: @color-theme
    }
  }
}
.list-fixed {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .fixed-title {
    height: 30px;
    line-height: 30px;
    font-size: @font-size-small;
    color: @color-text-l;
    padding-left: 20px;
    background: @color-highlight-background;
  }
}
.loading-container {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
