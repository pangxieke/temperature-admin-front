/*
 * @Author: your name
 * @Date: 2020-03-06 17:09:33
 * @LastEditTime: 2020-03-10 16:52:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/api/index.js
 */
import session from '@/api/modules/session'
import personnel from '@/api/modules/personnel'
import equipment from '@/api/modules/equipment'
import company from '@/api/modules/company'
import temperature from '@/api/modules/temperature'

export default {
  ...session,
  ...personnel,
  ...equipment,
  ...company,
  ...temperature
}
