<!--
 * @Author: your name
 * @Date: 2020-03-06 14:02:34
 * @LastEditTime: 2020-03-26 13:11:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/views/CompanyInfo.vue
 -->
<template>
  <div class="pa-8">
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="snackbarTimeout" :top="snackbarTop">
      <v-icon color="white">mdi-alert-rhombus-outline</v-icon>{{ snackbarText }}
    </v-snackbar>

    <h1 class="pb-8">单位管理</h1>
    <section v-if="userInfo.role === 0">
      <v-card class="px-5 mb-3">
        <v-col sm="12" md="4" xl="4" class="pt-8 pa-0">
          <v-text-field prepend-inner-icon="search" rounded v-model.trim="searchVal" placeholder="Search" filled dense small></v-text-field>
        </v-col>
      </v-card>

      <v-data-table
      hide-default-footer
      :headers="headers"
      :items="desserts"
      class="elevation-1"
      :page.sync="options.page"
      :items-per-page="24"
      >
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.name" label="单位名称"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.address" label="单位地址"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.tel" label="联系电话"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                <v-btn color="blue darken-1" text @click="save">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
        </template>

      </v-data-table>
      <div class="text-center pa-4">
        <v-pagination v-model="options.page" :length="pageCount" :total-visible="10" @input="next"></v-pagination>
      </div>
    </section>

    <section v-else>
      <v-row>
        <v-col cols="12" md="6">
          <v-card
            class="overflow-hidden"
            color="white"
          >
            <v-toolbar>
              <v-icon>mdi-account</v-icon>
              <v-toolbar-title class="font-weight-light">单位信息</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                fab
                small
                @click="cancelSave"
              >
                  <v-icon v-if="isEditing">mdi-close</v-icon>
                  <v-icon v-else>mdi-pencil</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                :disabled="!isEditing"
                label="单位名称"
                v-model.trim="name"
              ></v-text-field>
              <v-text-field
                :disabled="!isEditing"
                label="单位地址"
                v-model.trim="address"
              ></v-text-field>
              <v-text-field
                :disabled="!isEditing"
                label="联系电话"
                v-model.trim="tel"
              ></v-text-field>
              <v-text-field
                :disabled="!isEditing"
                label="新密码"
                v-model.trim="password"
              ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!isEditing"
                color="success"
                :loading="loading"
                @click="saveCompanyInfo"
              >
                  保存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class='pa-10' align='center'>
            <img class="qr-code" alt="qrcode" :src="qrcode">
            <v-card-text color="white-text">单位编码: {{userInfo.store_id}}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import md5 from 'blueimp-md5'
import generateQRCode from '@/utils/generateQRCode'

export default {
  name: 'CompanyInfo',
  data: () => ({
    qrcode: '',
    snackbar: '',
    snackbarText: '',
    snackbarTop: '',
    snackbarColor: '',
    snackbarTimeout: 3000,
    pageCount: 0,
    loading: false,
    dialog: false,
    searchVal: '',
    options: {
      page: 1,
      offset: 0,
      limit: 10
    },
    headers: [
      {
        text: '单位名称',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: '单位地址', value: 'address', sortable: false },
      { text: '联系电话', value: 'tel', sortable: false },
      { text: '操作', value: 'action', sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      address: 0,
      tel: 0
    },
    defaultItem: {
      name: '',
      address: 0,
      tel: 0
    },
    isEditing: null,
    name: '',
    address: '',
    tel: '',
    id: '',
    password: ''
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : '修改信息'
    },
    ...mapGetters(['userInfo'])
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  mounted () {
    if (this.userInfo.role === 0) {
      this.getCompanyList()
    } else if (this.userInfo.role === 1) {
      this.getStoreInfo()
    }
    this.setQuery()
    this.showQRCode('https://ai.baidu.com/facekit/page/form/E9F6EC9BDB8A4364BEA3DB864FE6B443')
  },
  methods: {
    async showQRCode (qrUrl) {
      this.qrcode = await generateQRCode(qrUrl)
    },
    async getStoreInfo () {
      try {
        const res = await this.$Api.getCompanyInfo()
        this.name = res.data.name
        this.address = res.data.address
        this.tel = res.data.tel
      } catch (e) {
        this.snackbar = true
        this.snackbarText = e.data.message
        this.snackbarColor = 'red'
      }
    },
    setQuery () {
      const path = this.$router.path
      this.$router.replace({ path, query: this.options })
    },
    next (page) {
      this.options.page = page
      this.options.offset = (page - 1) * 10
      this.setQuery(this.options)
      this.getCompanyList()
    },
    async getCompanyList () {
      try {
        this.loading = true
        const res = await this.$Api.getCompanyInfoLists({ ...this.options })
        this.desserts = res.data.data
        this.pageCount = Math.ceil(res.data.total / 10)
      } catch (e) {
        this.snackbar = true
        this.snackbarText = e.data.message
        this.snackbarColor = 'red'
      } finally {
        this.loading = false
      }
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      // console.log(this.editedIndex)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    cancelSave () {
      this.isEditing = !this.isEditing
    },

    async saveCompanyInfo () {
      try {
        this.loading = true
        const res = await this.$Api.updateCompanyInfo({
          id: this.userInfo.store_id,
          name: this.name,
          address: this.address,
          tel: this.tel,
          password: md5(this.password)
        })
        // this.getStoreInfo()
        this.snackbar = true
        this.snackbarText = res.message
        this.snackbarColor = 'green'
        this.$router.go(0)
      } catch (e) {
        this.loading = false
        this.snackbar = true
        this.snackbarText = e.data.message
        this.snackbarColor = 'red'
      } finally {
        this.isEditing = !this.isEditing
        this.loading = false
      }
    },

    async save () {
      if (this.editedIndex > -1) {
        // console.log(this.editedItem)
        try {
          this.loading = true
          await this.$Api.updateCompanyInfo({
            id: this.editedItem.Id,
            name: this.editedItem.name,
            address: this.editedItem.address,
            tel: this.editedItem.tel
          })
          this.getCompanyList()
          this.snackbar = true
          this.snackbarText = '修改成功!'
          this.snackbarColor = 'green'
        } catch (e) {
          this.snackbar = true
          this.snackbarText = '修改失败!'
          this.snackbarColor = 'red'
        }
      } else {
        // console.log(this.editedIndex)
        this.desserts.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>

<style>

</style>
