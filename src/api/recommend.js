import jsonp from '@/utils/jsonp'
import axios from 'axios'
import { commonParams, options } from './config'

const debug = process.env.NODE_ENV !== 'production'

// 获取轮播图数据
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 获取推荐列表数据
export function getDiscList () {
  const url = debug ? '/api/getDiscList' : 'http://ustbhuangyi/music/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'fqq',
    format: 'json',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
  })

  return axios.get(url, {
    params: data
  }).then(res => Promise.resolve(res.data))
}
