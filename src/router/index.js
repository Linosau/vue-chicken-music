import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Recommend = () => import('@/pages/recommend')
const Singer = () => import('@/pages/singer')
const SingerDetail = () => import('@/pages/singer-detail')
const Rank = () => import('@/pages/rank')
const Search = () => import('@/pages/search')

const routes = [
  {
    path: '',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/rank',
    component: Rank
  },
  {
    path: '/search',
    component: Search
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
