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
                    <v-list-item-title class="headline">注册</v-list-item-title>
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
                    v-model="name"
                    outlined
                    :rules="nameRules"
                    label="单位名称"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="address"
                    outlined
                    :rules="addressRules"
                    label="详细地址"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="tel"
                    outlined
                    :rules="telRules"
                    label="联系电话"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model.trim="password"
                    outlined
                    label="密码"
                    name="password"
                    type="password"
                    :rules="passwordRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model.trim="checkPass"
                    outlined
                    label="确认密码"
                    name="checkpw"
                    type="password"
                    :rules="[checkPassRules]"
                    @keyup.enter.native="submit()"
                  ></v-text-field>
                  <v-btn color="primary" class="mt-8 white--text" @click="submit" block large :loading="loading">
                    注册
                  </v-btn>
                  <div align="center" class="body-2">
                    已注册?<v-btn text to="/login" color="primary">立即登录</v-btn>
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
import sleep from '@/utils/sleep'
import md5 from 'blueimp-md5'
export default {
  name: 'Register',
  data () {
    return {
      snackbar: '',
      snackbarText: '',
      snackbarTop: '',
      snackbarColor: '',
      snackbarTimeout: 3000,
      lazy: false,
      valid: true,
      loading: false,
      username: '',
      usernameRules: [
        v => !!v || '账号不能为空'
      ],
      password: '',
      passwordRules: [
        v => !!v || '密码不能为空'
      ],
      checkPass: '',
      name: '',
      nameRules: [
        v => !!v || '单位不能为空'
      ],
      address: '',
      addressRules: [
        v => !!v || '地址不能为空'
      ],
      tel: '',
      telRules: [
        v => !!v || '联系电话不能为空'
      ]
    }
  },
  methods: {
    checkPassRules (value) {
      if (value === '') {
        return '请确认密码'
      } else if (value !== this.password) {
        return '两次输入密码不一致!'
      } else {
        return true
      }
    },
    async submit (e) {
      e && e.preventDefault()
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$Api.register({
            username: this.username,
            password: md5(this.password),
            name: this.name,
            address: this.address,
            tel: this.tel
          })
          // console.log(res)
          this.$router.replace('/')
        } catch (e) {
          // console.log(e)
          this.snackbar = true
          this.snackbarText = e.data.message
          this.snackbarColor = 'red'
          await sleep(1000)
          this.$router.replace('/login')
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
