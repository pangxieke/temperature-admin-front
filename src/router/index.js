/*
 * @Author: your name
 * @Date: 2020-03-06 10:58:59
 * @LastEditTime: 2020-03-09 17:32:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/router/index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Index = () => import('@/views/Index')
const Login = () => import('@/views/Login')
const Register = () => import('@/views/Register')
const TemperatureData = () => import('@/views/TemperatureData')
const PersonnelManagement = () => import('@/views/PersonnelManagement')
const EquipmentManagement = () => import('@/views/EquipmentManagement')
const CompanyInfo = () => import('@/views/CompanyInfo')
const NoFound = () => import('@/views/NoFound')

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    redirect: '/temperature-data',
    children: [
      {
        path: 'temperature-data',
        name: 'TemperatureData',
        component: TemperatureData,
        meta: { title: '温度数据', loginRequired: true }
      },
      {
        path: 'personnel-management',
        name: 'PersonnelManagement',
        component: PersonnelManagement,
        meta: { title: '人员管理', loginRequired: true }
      },
      {
        path: 'equipment-management',
        name: 'EquipmentManagement',
        component: EquipmentManagement,
        meta: { title: '设备管理', loginRequired: true }
      },
      {
        path: 'company-information',
        name: 'CompanyInfo',
        component: CompanyInfo,
        meta: { title: '单位信息', loginRequired: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册' }
  },
  {
    path: '*',
    name: 'NoFound',
    component: NoFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.loginRequired) {
    if (!sessionStorage.getItem('token')) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  next()
})

router.afterEach(to => {
  document.title = to.meta.title
})

export default router
