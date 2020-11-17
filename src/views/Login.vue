<!--
 * @Author: your name
 * @Date: 2020-03-06 13:44:14
 * @LastEditTime: 2020-04-10 09:52:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/views/Login.vue
 -->
<template>
  <v-app>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="snackbarTimeout" :top="snackbarTop">
      <v-icon color="white">mdi-alert-rhombus-outline</v-icon>{{ snackbarText }}
    </v-snackbar>

    <v-content class="bg-img">
      <v-container
        class="fill-height"
        fluid
      >
        <v-row align="center" justify="center">
            <v-col cols="12" sm="6" md="4" xs="4" lg="4" align="center">
              <v-card class="mt-n10 pa-3 elevation-8">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="headline pb-3">登录</v-list-item-title>
                    <v-list-item-subtitle>请输入您的账号和密码以继续</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-form ref="form" v-model="valid" :lazy-validation="lazy" class="px-8">
                  <v-text-field
                    class="pt-12"
                    v-model="username"
                    outlined
                    :rules="usernameRules"
                    label="账号"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    outlined
                    label="密码"
                    name="password"
                    type="password"
                    :rules="passwordRules"
                    required
                    @keyup.enter.native="submit()"
                  ></v-text-field>
                  <v-btn color="primary" class="mt-4" @click="submit" block large :loading="loading">
                    登录
                  </v-btn>
                  <div align="center" class="body-2">
                    你还没有注册?<v-btn text to="/register" color="primary">立即注册</v-btn>
                  </div>
                </v-form>
              </v-card>
            </v-col>
          </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import sleep from '@/utils/sleep'
import md5 from 'blueimp-md5'

export default {
  name: 'Login',
  data () {
    return {
      snackbar: '',
      snackbarText: '',
      snackbarTop: '',
      snackbarColor: '',
      snackbarTimeout: 3000,
      loading: false,
      valid: true,
      lazy: false,
      username: '',
      usernameRules: [v => !!v || '账号不能为空'],
      password: '',
      passwordRules: [v => !!v || '密码不能为空']
    }
  },

  methods: {
    ...mapActions(['updateUserInfo']),
    async submit (e) {
      e && e.preventDefault()
      if (this.$refs.form.validate()) {
        // console.log(1)
        try {
          this.loading = true
          const res = await this.$Api.login({
            username: this.username,
            password: md5(this.password)
          })
          // console.log(res)
          sessionStorage.setItem('token', res.data.token)
          this.updateUserInfo({
            username: res.data.userName,
            role: res.data.role,
            store_id: res.data.id
          })
          this.$router.replace('/')
        } catch (e) {
          this.snackbar = true
          this.snackbarText = e.data.message
          this.snackbarColor = 'red'
          await sleep(3000)
        } finally {
          this.loading = false
        }
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.bg-img {
  background: url(../assets/bg.png) no-repeat;
  background-position: center center;
  background-size:100% 100%;
}
.v-card:not(.v-sheet--tile):not(.v-card--shaped) {
  border-radius: 15px;
}
</style>>
