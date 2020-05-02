import { playMode } from '@/utils/config'

const state = {
  singer: {}, // 当前歌手信息
  playing: false, // 是否正在播放
  fullScreen: false, // 是否是全屏
  playlist: [], // 歌曲默认播放列表
  sequenceList: [], // 各播放模式下排序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1 // 当前播放歌曲的索引
}

export default state
