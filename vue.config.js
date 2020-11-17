/*
 * @Author: your name
 * @Date: 2020-03-06 11:31:19
 * @LastEditTime: 2020-04-09 19:02:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/vue.config.js
 */
const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  productionSourceMap: false,
  devServer: {
    proxy: 'http://***:19980'
    // proxy: {
    //   '/api/back': {
    //     target: 'http://192.168.1.226:19980/',
    //     changeOrigin: true
    //   }
    // }
  },
  chainWebpack: config => {
    // 配置解析别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
  }
}
