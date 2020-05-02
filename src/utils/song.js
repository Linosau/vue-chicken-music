import { getSongsUrl } from '@/api/song'
import { ERR_OK } from '@/api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor ({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }
}

export function createSong (musicData) {
  const { songid, songmid, singer, songname, albumname, interval, albummid, url } = musicData
  return new Song({
    id: songid,
    mid: songmid,
    singer: filterSinger(singer),
    name: songname,
    album: albumname,
    duration: interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`,
    url: url
  })
}

function filterSinger (singer) {
  const ret = []
  if (!singer) {
    return ''
  }

  singer.forEach(item => {
    ret.push(item.name)
  })

  return ret.join('/')
}

export function isValidMusic (musicData) {
  return musicData.songid && musicData.albummid
  // return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

export function processSongsUrl (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return getSongsUrl(songs).then(purlMap => {
    songs = songs.filter(song => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        return true
      }
      return false
    })
    return songs
  })
}
