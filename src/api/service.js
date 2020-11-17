/*
 * @Author: your name
 * @Date: 2020-03-06 16:55:10
 * @LastEditTime: 2020-03-11 19:23:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/api/service.js
 */
import axios from 'axios'
import router from '@/router'

axios.defaults.timeout = 10000
axios.defaults.baseURL = '/api/back'

axios.interceptors.request.use(
  config => {
    config.headers.common.Authorization = `Bearer ${sessionStorage.getItem('token')}`
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    const { code } = response.data.code
    // console.log(response)
    // console.log(code)
    switch (code) {
      case 40101:
        // console.log('登陆超时，请重新登陆')
        router.replace('/login')
        break
      case 10000:
        // console.log('缺少必要的参数')
        break
      case 10002:
        // console.log('参数格式有误')
        break
      case 10004:
        // console.log('参数验证失败')
        break
      case 40103:
        // console.log('没有访问权限')
        break
      case 50000:
        // console.log('服务器内部错误')
        break
      default:
        return response.data
    }
  },
  error => {
    return Promise.reject(error.response)
  }
)

export default {
  get (url, params = {}) {
    return axios.get(url, { params: params })
  },
  post (url, params = {}) {
    return axios.post(url, params)
  },
  put (url, params = {}) {
    return axios.put(url, params)
  },
  delete (url, params = {}) {
    return axios.delete(url, params)
  }
}
