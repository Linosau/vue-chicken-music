<template>
  <transition appear name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage" />
  </transition>
</template>

<script type='text/ecmascript-6'>
import MusicList from '@/components/MusicList'
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import { createSong, isValidMusic, processSongsUrl } from '@/utils/song'

export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    async _getDetail () {
      const id = this.singer.id
      if (!id) {
        this.$router.push('/singer')
        return
      }

      const res = await getSingerDetail(id)
      console.log(res.data.list)
      if (res.code === ERR_OK) {
        this.songs = await processSongsUrl(this._normalizeSongs(res.data.list))
        console.log(this.songs)
      }
    },
    _normalizeSongs (list) {
      const ret = []
      list.forEach(item => {
        const { musicData } = item
        // 判断是否为有效歌曲，包括是否收费
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  mounted () {
    this._getDetail()
  }
}
</script>

<style rel='stylesheet/less' lang='less' scoped>
.slide-enter-active, .slide-leave-active {
  transition: all .3s;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
