<!--
 * @Author: your name
 * @Date: 2020-03-06 14:06:45
 * @LastEditTime: 2020-04-08 11:38:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/views/EquipmentManagement.vue
 -->
<template>
  <div class="pa-8">
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="snackbarTimeout" :top="snackbarTop">
      <v-icon color="white">mdi-alert-rhombus-outline</v-icon>{{ snackbarText }}
    </v-snackbar>

    <h1 class="pb-8">设备管理</h1>
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
      :items-per-page="options.limit"
    >
      <template v-slot:top>
        <v-dialog v-model="equipmentDialog" max-width="500px">

          <!-- 普通用户可以新增设备 -->
          <template v-slot:activator="{ on }" v-if="userInfo.role === 1">
            <v-btn color="primary ma-4" dark class="mb-2" v-on="on">新增</v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form v-model="valid" ref="equipmentForm">
                  <v-select
                    v-if="userInfo.role === 0 ? true: false"
                    label="所属企业"
                    :items='company'
                    item-text="text"
                    item-value="value"
                    outlined
                    v-model="editedItem.store_id"
                  ></v-select>
                  <v-text-field required :rules="[v => !!v || '设备序列号不能为空']" v-model="editedItem.sn" label="设备序列号" :disabled="editedIndex === -1 ? false : true" ></v-text-field>
                  <v-select
                    :items="province"
                    item-text="name"
                    item-value="code"
                    label="省份"
                    v-model="editedItem.province"
                    @change='provinceChange'
                    required
                    :rules="[v => !!v || '省份必选']"
                  ></v-select>
                  <v-select
                    :items="city"
                    item-text="name"
                    item-value="code"
                    label="城市"
                    v-model="editedItem.city"
                    @change='cityChange'
                    required
                    :rules="[v => !!v || '城市必选']"
                  ></v-select>
                  <v-textarea
                    outlined
                    v-model="editedItem.remake"
                    name="input-7-4"
                    label="备注"
                  ></v-textarea>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">取消</v-btn>
              <v-btn color="blue darken-1" text @click="save">确定</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ $Dayjs(item.created_at * 1000).format('YYYY-MM-DD HH:mm') }}
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
  </v-data-table>
    <div class="text-center pa-4">
      <v-pagination v-model="options.page" :length="pageCount" :total-visible="10" @input="next"></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import city from '@/utils/city.json'
import provinces from '@/utils/provinces.json'
export default {
  name: 'EquipmentManagement',
  data: () => ({
    province: provinces,
    valid: true,
    city: city,
    snackbar: '',
    snackbarText: '',
    snackbarTop: '',
    snackbarColor: '',
    snackbarTimeout: 3000,
    company: [],
    currentStore: 0,
    pageCount: 0,
    loading: false,
    equipmentDialog: false,
    searchVal: '',
    options: {
      page: 1,
      offset: 0,
      limit: 10
    },
    storeOptions: {
      offset: 0,
      limit: 1000
    },
    headers: [
      {
        text: '注册编号',
        align: 'start',
        sortable: false,
        value: 'sn'
      },
      { text: '注册时间', value: 'created_at', sortable: false },
      { text: '备注', value: 'remake', sortable: false },
      { text: '操作', value: 'action', sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      sn: '',
      remake: '',
      store_id: '',
      province: 0,
      city: 0
    },
    defaultItem: {
      sn: '',
      remake: '',
      store_id: '',
      province: 0,
      city: 0
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增设备' : '修改设备'
    },
    ...mapGetters(['userInfo'])
  },

  watch: {
    equipmentDialog (val) {
      val || this.close()
    }
  },

  created () {
    this.setQuery()
  },

  mounted () {
    this.getEquipmentList()
  },
  methods: {
    provinceChange (val) {
      console.log(val)
      const cities = []
      city.filter(item => {
        if (item.provinceCode === val) {
          cities.push(item)
        }
      })
      this.city = cities
    },
    cityChange (val) {
      console.log(val)
    },
    async getStoreList () {
      try {
        this.loading = true
        const res = await this.$Api.getCompanyInfoLists({ ...this.storeOptions })
        const storeList = res.data.data.map(store => {
          const newObj = {}
          newObj.text = store.name
          newObj.value = store.Id
          return newObj
        })
        this.company = storeList
        // console.log(this.company)
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
      this.getEquipmentList()
    },
    async getEquipmentList () {
      try {
        this.loading = true
        const res = await this.$Api.getEquipmentLists({ ...this.options })
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
      item.city = String(item.city)
      item.province = String(item.province)
      console.log(item)
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.equipmentDialog = true
      // 超级管理员修改设备所属企业，获取企业列表
      if (this.userInfo.role === 0) {
        this.getStoreList()
      }
    },

    async deleteItem (item) {
      // console.log(item)
      if (confirm('确认解绑当前项么?')) {
        try {
          this.loading = true
          await this.$Api.deleteEquipment(item.sn)
          this.getEquipmentList()
          this.snackbar = true
          this.snackbarText = '解绑成功!'
          this.snackbarColor = 'green'
        } catch (e) {
          this.snackbar = true
          this.snackbarText = e.data.message
          this.snackbarColor = 'red'
        }
      } else {
        this.snackbar = true
        this.snackbarText = '已取消解绑'
      }
    },

    close () {
      this.equipmentDialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 100)
    },

    async save () {
      if (this.editedIndex > -1) {
        if (this.$refs.equipmentForm.validate()) {
          // 修改保存
          try {
            const res = await this.$Api.updateEquipment({
              sn: this.editedItem.sn,
              remake: this.editedItem.remake,
              // 超级管理员 选定企业绑定， 普通商户绑定到当前企业
              store_id: this.userInfo.role === 0 ? this.editedItem.store_id : this.userInfo.store_id,
              province: Number(this.editedItem.province),
              city: Number(this.editedItem.city)
            })
            this.getEquipmentList()
            this.snackbar = true
            this.snackbarText = res.message
            this.snackbarColor = 'green'
            this.close()
          } catch (e) {
            this.snackbar = true
            this.snackbarText = e.data.message
            this.snackbarColor = 'red'
          }
        }
      } else {
        // 新增保存
        if (this.$refs.equipmentForm.validate()) {
          try {
            await this.$Api.updateEquipment({
              sn: this.editedItem.sn,
              store_id: this.userInfo.store_id,
              remake: this.editedItem.remake,
              province: Number(this.editedItem.province),
              city: Number(this.editedItem.city)
            })
            this.getEquipmentList()
            this.snackbar = true
            this.snackbarText = '绑定成功!'
            this.snackbarColor = 'green'
            this.close()
          } catch (e) {
            this.snackbar = true
            this.snackbarText = e.data.message
            this.snackbarColor = 'red'
          }
        }
      }
    }
  }
}
</script>

<style>

</style>
