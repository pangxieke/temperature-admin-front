<!--
 * @Author: your name
 * @Date: 2020-03-06 14:06:19
 * @LastEditTime: 2020-03-18 12:13:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/views/PersonnelManagement.vue
 -->
<template>
  <div class="pa-8">
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="snackbarTimeout" :top="snackbarTop">
      <v-icon color="white">mdi-alert-rhombus-outline</v-icon>{{ snackbarText }}
    </v-snackbar>

    <h1 class="pb-8">人员管理</h1>
    <v-card class="px-5 mb-3">
      <v-col sm="12" md="4" xl="4" class="pt-8 pa-0">
        <v-text-field prepend-inner-icon="search" rounded v-model.trim.lazy="searchVal" @change="search" placeholder="Search" filled dense small></v-text-field>
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
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref='form' v-model="valid" :lazy-validation="lazy">
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.name" label="姓名"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model.trim.number="editedItem.age" label="年龄" :rules='ageRules'></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.id_num" label="身份证号" :rules='userNoRules' :counter="18"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model.trim="editedItem.tel" label="电话号码" :rules='telRules' :counter="11"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.department" label="部门"></v-text-field>
                    </v-col>
                   </v-row>
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
          v-if="userInfo.role !== 0"
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
export default {
  name: 'PersonnelManagement',
  data: () => ({
    valid: true,
    lazy: false,
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
        text: '姓名',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: '年龄', value: 'age', sortable: false },
      { text: '身份证号', value: 'id_num', sortable: false },
      { text: '手机', value: 'tel', sortable: false },
      { text: '部门', value: 'department', sortable: false },
      { text: '注册时间', value: 'created_at', sortable: false },
      { text: '操作', value: 'action', sortable: false }
    ],
    telRules: [
      v => /^[0-9]{11}$/.test(v) || '请输入11位数字'
    ],
    ageRules: [
      v => /^[0-9]{1,}$/.test(v) || '请输入数字'
    ],
    userNoRules: [
      v => /^[Xx0-9]{18}$/.test(v) || '请输入18位身份证号'
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      age: 0,
      id_num: '',
      tel: '',
      department: ''
    },
    defaultItem: {
      name: '',
      age: 0,
      id_num: '',
      tel: '',
      department: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : '修改人员信息'
    },
    ...mapGetters(['userInfo'])
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.setQuery()
  },

  mounted () {
    this.getPersonnelList()
  },

  methods: {
    search (val) {
      this.options.name = val
      this.getPersonnelList()
    },
    setQuery () {
      const path = this.$router.path
      this.$router.replace({ path, query: this.options })
    },
    next (page) {
      // console.log('page', page)
      this.options.page = page
      this.options.offset = (page - 1) * 10
      this.setQuery(this.options)
      this.getPersonnelList()
    },
    async getPersonnelList () {
      try {
        this.loading = true
        const res = await this.$Api.getPersonnelLists({ ...this.options })
        if (res) {
          // console.log(res)
          this.desserts = res.data.data
          this.pageCount = Math.ceil(res.data.total / 10)
        } else {
          this.snackbar = true
          this.snackbarText = res.message
        }
      } catch (e) {
        this.snackbar = true
        this.snackbarText = e.data.message
        this.snackbarColor = 'red'
      } finally {
        this.loading = false
      }
    },

    editItem (item) {
      // console.log(item)
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem (item) {
      // console.log(item)
      if (confirm('确认删除当前项么?')) {
        try {
          this.loading = true
          await this.$Api.deletePerson(item.id)
          this.getPersonnelList()
          this.snackbar = true
          this.snackbarText = '删除成功!'
          this.snackbarColor = 'green'
        } catch (e) {
          this.snackbar = true
          this.snackbarText = '删除失败!'
          this.snackbarColor = 'red'
        }
      } else {
        this.snackbar = true
        this.snackbarText = '已取消删除'
      }
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async save () {
      if (this.editedIndex > -1) {
        // console.log(this.editedItem)
        if (this.$refs.form.validate()) {
          try {
            this.loading = true
            await this.$Api.updatePerson({
              id: this.editedItem.id,
              name: this.editedItem.name,
              tel: this.editedItem.tel,
              id_num: this.editedItem.id_num,
              age: Number(this.editedItem.age),
              department: this.editedItem.department
            })
            this.getPersonnelList()
            this.snackbar = true
            this.snackbarText = '修改成功!'
            this.snackbarColor = 'green'
          } catch (e) {
            this.snackbar = true
            this.snackbarText = '修改失败!'
            this.snackbarColor = 'red'
          }
          this.close()
        }
      } else {
        this.desserts.push(this.editedItem)
      }
    }
  }
}
</script>

<style>

</style>
