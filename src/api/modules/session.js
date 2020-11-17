/*
 * @Author: your name
 * @Date: 2020-03-06 17:10:13
 * @LastEditTime: 2020-03-11 11:42:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/api/modules/session.js
 */
import service from '@/api/service'

export default {
  login (params) {
    return service.post('/login', params)
  },
  register (params) {
    return service.put('/register', params)
  }
}
