import axios from 'axios'
import { getUid } from '@/utils/uid'
import { commonParams, ERR_OK } from './config'

const debug = process.env.NODE_ENV !== 'production'

export function getSongsUrl (songs) {
  const url = debug ? '/api/getPurlUrl' : ''

  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = genUrlMid(mids, types)

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3

    function _request () {
      return axios.post(url, {
        comm: data,
        req_0: urlMid
      }).then(response => {
        const res = response.data

        if (res.code === ERR_OK) {
          const urlMid = res.req_0
          if (urlMid && urlMid.code === ERR_OK) {
            const purlMap = {}
            urlMid.data.midurlinfo.forEach(item => {
              if (item.purl) {
                purlMap[item.songmid] = item.purl
              }
            })

            if (Object.keys(purlMap).length > 0) {
              resolve(purlMap)
            } else {
              _retry()
            }
          } else {
            _retry()
          }
        } else {
          _retry()
        }
      })
    }

    function _retry () {
      if (--tryTime >= 0) {
        _request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    _request()
  })
}

// 批量拿到这个歌曲列表的 midUrlInfo
function genUrlMid (mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
