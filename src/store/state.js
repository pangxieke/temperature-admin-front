/*
 * @Author: your name
 * @Date: 2020-03-09 11:18:55
 * @LastEditTime: 2020-03-09 14:05:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/store/state.js
 */
const defaultUserInfo = {
  username: '小明',
  role: 0
}

export default {
  userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')) || defaultUserInfo
}
