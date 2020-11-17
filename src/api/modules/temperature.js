/*
 * @Author: your name
 * @Date: 2020-03-10 16:50:57
 * @LastEditTime: 2020-03-10 16:51:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/api/modules/temperature.js
 */
import service from '@/api/service'

export default {
  getTemperatureList (params) {
    return service.get('/temp', params)
  }
}
