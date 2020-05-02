<template>
  <div class="singer">
    <list-view @select="selectSinger" :data="singers" />
    <router-view></router-view>
  </div>
</template>

<script type='text/ecmascript-6'>
import ListView from '@/base/Listview'
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import Singer from '@/utils/singer'
import { mapMutations } from 'vuex'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default {
  name: 'singer',
  components: {
    ListView
  },
  data () {
    return {
      singers: []
    }
  },
  methods: {
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })

      const ret = []
      const hot = []
      for (let key in map) {
        const val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))

      return [...hot, ...ret]
    },
    async _getSingerList () {
      const res = await getSingerList()
      if (res.code === ERR_OK) {
        this.singers = this._normalizeSinger(res.data.list)
        console.log(this.singers)
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  mounted () {
    this._getSingerList()
  }
}
</script>

<style rel='stylesheet/less' lang='less' scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
