/*
 * @Author: your name
 * @Date: 2020-03-06 18:24:17
 * @LastEditTime: 2020-03-09 10:56:04
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/utils/sleep.js
 */
export default function (ms = 2000) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms)
  })
}
