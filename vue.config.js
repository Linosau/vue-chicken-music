const path = require('path')
const axios = require('axios')
const bodyParser = require('body-parser')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const BASE_URL = process.env.NODE_ENV === 'production' ? '/vue-chicken-music' : '/'

module.exports = {
  publicPath: BASE_URL,
  lintOnSave: true,
  chainWebpack (config) {
    config.resolve.alias.set('@', resolve('src'))
  },
  configureWebpack: {
    externals: process.env.NODE_ENV === 'production' ? {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios'
    } : {}
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/styles/mixin.less'),
        path.resolve(__dirname, './src/styles/variable.less')
      ]
    }
  },
  devServer: {
    before (app) {
      // 代理recommend——getDiscList
      app.get('/api/getDiscList', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

        axios.get(url, {
          headers: {
            host: 'c.y.qq.com',
            referer: 'https://c.y.qq.com/'
          },
          params: req.query
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.log(e)
        })
      }),

      // 代理singer——getPurlUrl
      app.post('/api/getPurlUrl', bodyParser.json(), (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

        axios.post(url, req.body, {
          headers: {
            origin: 'https://y.qq.com',
            referer: 'https://y.qq.com/',
            'Content-type': 'application/x-www-form-urlencoden'
          }
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
