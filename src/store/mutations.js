/*
 * @Author: your name
 * @Date: 2020-03-09 11:19:41
 * @LastEditTime: 2020-03-09 11:26:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/store/mutations.js
 */
export const UPDATE_USER_INFO = (state, payload) => {
  state.userInfo = {
    ...state.userInfo,
    ...payload
  }
  window.sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo))
}
