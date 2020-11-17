<!--
 * @Author: your name
 * @Date: 2020-03-06 14:15:29
 * @LastEditTime: 2020-03-06 14:15:54
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/views/NoFound.vue
 -->
<template>
  <v-app>
    <v-content class="notfound-img">
      <v-container class="fill-height">
        <v-row align="center" justify="center">
          <v-col align="center">
            <h1 class="white--text font-weight-black title">404</h1>
            <div class="white--text display-3 mb-5 mt-10">Page not found :(</div>
            <v-btn class="black white--text link" to="/">返回首页</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style lang="scss">
.notfound-img {
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(../assets/404.jpg);
  background-position: center center;
  .title {
    font-size: 192px !important;
    letter-spacing: 14px !important;
    font-weight: 700 !important;
    margin-top: 60px;
    margin-bottom: 100px;
  }
}
</style>
