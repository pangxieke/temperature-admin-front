/*
 * @Author: your name
 * @Date: 2020-03-09 16:27:00
 * @LastEditTime: 2020-03-11 15:45:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/api/modules/personnel.js
 */
import service from '@/api/service'

export default {
  getPersonnelLists (params) {
    return service.get('/user', params)
  },
  deletePerson (id) {
    return service.delete(`/user/${id}`)
  },
  updatePerson (params) {
    return service.post('/user', params)
  }
}
