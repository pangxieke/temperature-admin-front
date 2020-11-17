/*
 * @Author: your name
 * @Date: 2020-03-09 17:23:21
 * @LastEditTime: 2020-03-12 15:04:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/api/modules/company.js
 */
import service from '@/api/service'

export default {
  getCompanyInfoLists (params) {
    return service.get('/store', params)
  },
  updateCompanyInfo (params) {
    return service.post('/store', params)
  },
  getCompanyInfo (params) {
    return service.get('/store/info', params)
  }
}
