/*
 * @Author: your name
 * @Date: 2020-03-09 11:19:08
 * @LastEditTime: 2020-03-09 11:24:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/store/actions.js
 */
export const updateUserInfo = ({ commit }, payload) => {
  commit('UPDATE_USER_INFO', payload)
}
