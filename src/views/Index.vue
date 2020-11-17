<!--
 * @Author: your name
 * @Date: 2020-03-06 13:34:03
 * @LastEditTime: 2020-04-03 15:36:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/views/Index.vue
 -->
<template>
  <v-app class="">
    <v-dialog v-model="qrCodeDialog" persistent max-width="500" v-if="userInfo.role">
      <v-card class='pa-10' align='center'>
        <h2>注册信息</h2>
        <v-card-text>用于单位人员注册，可在单位信息中查看</v-card-text>
        <img class="qr-code" alt="qrcode" :src="qrcode">
        <v-card-text color="white-text">单位编码: {{userInfo.store_id}}</v-card-text>
        <v-card-actions class="qr-btn">
          <v-btn @click="qrCodeDialog = false" class="primary" min-width="300">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-navigation-drawer
      v-model="drawer"
      app
      :clipped="$vuetify.breakpoint.lgAndUp"
    >
      <v-list light dense>
        <v-list-item to="/temperature-data">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>体温信息</v-list-item-title>
        </v-list-item>
        <v-list-item to="/personnel-management">
          <v-list-item-icon>
            <v-icon>mdi-bug</v-icon>
          </v-list-item-icon>
          <v-list-item-title>人员管理</v-list-item-title>
        </v-list-item>
        <v-list-item to="/equipment-management">
          <v-list-item-icon>
            <v-icon>mdi-alpha-a-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-title>设备管理</v-list-item-title>
        </v-list-item>
        <v-list-item to="/company-information">
          <v-list-item-icon>
            <v-icon>mdi-face-woman</v-icon>
          </v-list-item-icon>
          <v-list-item-title>单位信息</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color='white'
    >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 "
      >
        <span class="hidden-sm-and-down">监测管理系统</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon class="mr-8">
        <v-icon>mdi-bell</v-icon>
      </v-btn>

      <v-menu offset-y>
      <template v-slot:activator="{ on }" >
        <div
          v-on="on"
          class="mr-4 d-flex align-center"
        >
          <v-avatar>
          <img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            alt="John"
          >
          </v-avatar>
          <div class="ml-4 align-center">
            {{userInfo.username}}
            <p>{{userInfo.role === 0 ? '超级管理员' : '普通用户'}}</p>
          </div>
        </div>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="Logout('logout')"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    </v-app-bar>

    <v-content class="content-bg">

      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import generateQRCode from '@/utils/generateQRCode'

export default {
  name: 'Index',
  computed: {
    ...mapGetters(['userInfo'])
  },
  components: {
  },
  data: () => ({
    qrcode: '',
    qrCodeDialog: true,
    drawer: null,
    items: [{
      key: 'logout',
      title: '退出登录'
    }]
  }),
  mounted () {
    this.showQRCode('https://ai.baidu.com/facekit/page/form/E9F6EC9BDB8A4364BEA3DB864FE6B443')
  },
  methods: {
    async showQRCode (qrUrl) {
      this.qrCodeDialog = true
      this.qrcode = await generateQRCode(qrUrl)
    },
    Logout (value) {
      // console.log(value)
      if (value === 'logout') {
        sessionStorage.removeItem('token')
        this.$router.replace('/login')
      }
    }
  }
}
</script>

<style lang="scss">
.v-application p{
  margin-bottom: 0;
}
.content-bg {
  background:rgba(245,246,250,1);
}
.qr-btn {
  justify-content: center;
}
</style>
