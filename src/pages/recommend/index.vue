<template>
  <section class="recommend">
    <scroll
      :data="discList"
      ref="scroll"
      class="recommend-content"
    >
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="recommends.length">
              <div v-for="item in recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl" >
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul v-if="discList && discList.length">
            <li
              v-for="item in discList"
              :key="item.dissid"
              class="item"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </section>
</template>

<script type='text/ecmascript-6'>
import { getRecommend, getDiscList } from '@/api/recommend'
import { ERR_OK } from '@/api/config'
import Slider from '@/base/Slider'
import Scroll from '@/base/Scroll'
import Loading from '@/base/Loading'

export default {
  name: 'recommend',
  components: {
    Slider,
    Scroll,
    Loading
  },
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  methods: {
    loadImage () {
      if (!this.checkloaded) {
        this.checkloaded = true
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    },
    async _getRecommend () {
      const res = await getRecommend()
      if (res.code === ERR_OK) {
        this.recommends = res.data.slider
      }
    },
    async _getDiscList () {
      const res = await getDiscList()
      if (res.code === ERR_OK) {
        this.discList = res.data.list
      }
    }
  },
  mounted () {
    this._getRecommend()
    this._getDiscList()
  }
}
</script>

<style rel='stylesheet/less' lang='less' scoped>
.recommend {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  .recommend-content {
    height: 100%;
    overflow: hidden;
  }
}

.slider-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 40%;
  overflow: hidden;
  .slider-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.recommend-list {
  .list-title {
    height: 65px;
    line-height: 65px;
    color: @color-theme;
    font-size: @font-size-medium;
    text-align: center;
  }
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px 20px;
    .icon {
      flex: 0 0 60px;
      width: 60px;
      padding-right: 20px;
    }
    .text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: @font-size-medium;
      line-height: 20px;
      overflow: hidden;
      .name {
        color: @color-text;
        margin-bottom: 10px;
      }
      .desc {
        color: @color-text-d;
      }
    }
  }
}

.loading-container {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
