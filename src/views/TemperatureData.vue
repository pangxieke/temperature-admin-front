<!--
 * @Author: your name
 * @Date: 2020-03-06 14:00:41
 * @LastEditTime: 2020-04-09 16:59:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /temperature-admin/src/views/TemperatureData.vue
 -->
<template>
  <div class="pa-8">
    <h1 class="pb-8">体温信息筛查</h1>

    <div>
      <v-col sm="12" md="6" xl="4" class="pa-0 pb-8">
        <v-card outlined>
          <v-tabs
            grow
            color="blue"
            active-class="outline font-weight-black subtitle-1"
            show-arrows
            v-model="tab"
            @change="tabChange"
            height="70px"
          >
            <img src="@/assets/temp_icon.png" alt="" class="temp_img ma-2">
            <v-tab href="#Anomalies" >体温异常</v-tab>
            <v-tab href="#Info" >体温信息</v-tab>
            <v-tab href="#PersonInfo" >个人体温轨迹</v-tab>
          </v-tabs>
        </v-card>
      </v-col>

      <v-tabs-items v-model="tab">

        <v-tab-item :value="'Anomalies'" class="tab_bg">
          <v-card class="pa-7" height="444">
            <ScatterChart v-model="abnormal.chartsData" :time="abnormal.time" @change-time="changeTime"></ScatterChart>
          </v-card>

          <h1 class="pb-8 mt-10">体温异常记录</h1>

          <div>
            <v-data-table
              hide-default-footer
              :headers="headers"
              :items="abnormal.desserts"
              class="elevation-1"
              :page.sync="abnormal.options.page"
              :items-per-page="24"
            >
              <template v-slot:item.created_at="{ item }">
                {{ $Dayjs(item.created_at * 1000).format('YYYY-MM-DD HH:mm') }}
              </template>
              <template v-slot:item.num="{ item }">
                <v-chip
                  class="ma-2"
                  :color="getColor(item.num)"
                  text-color="white"
                >

                  {{Number(item.num).toFixed(1)}}
                </v-chip>
              </template>
            </v-data-table>

            <div class="text-center pa-4">
              <v-pagination v-model="abnormal.options.page" :length="abnormal.pageCount" :total-visible="10" @input="nextAbnormal"></v-pagination>
            </div>
          </div>

        </v-tab-item>

        <v-tab-item :value="'Info'" class="tab_bg">
          <div>
            <v-card class="px-5 mb-3 pt-5">

              <v-row>
                <v-col sm="12" md="12" xl="12">
                  <v-card outlined>
                    <v-tabs
                      grow
                      hide-slider
                      color="blue"
                      active-class="outline font-weight-black subtitle-1"
                      show-arrows
                      v-model.lazy="normal.timeTab"
                      @change="tempChange"
                    >
                      <v-tab :href="`#daily`">今日</v-tab>
                      <v-tab :href="`#weekly`">近7天</v-tab>
                    </v-tabs>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    label="人脸身份ID"
                    v-model.trim.lazy="normal.options.user_no"
                    @change="tempChange"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    label="姓名"
                    v-model.trim.lazy="normal.options.name"
                    @change="tempChange"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    label="身份证号"
                    v-model.trim.lazy="normal.options.id_num"
                    @change="tempChange"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                  <v-select
                    :items="normal.tempRange"
                    label="体温范围"
                    v-model.lazy="normal.options.num"
                    @change="tempChange"
                    item-text="state"
                    item-value="temp"
                  ></v-select>
                </v-col>
              </v-row>

            </v-card>
            <v-data-table
              hide-default-footer
              :headers="headers"
              :items="normal.desserts"
              class="elevation-1"
              :page.sync="normal.options.page"
              :items-per-page="24"
              >
              <template v-slot:item.created_at="{ item }">
                {{ $Dayjs(item.created_at * 1000).format('YYYY-MM-DD HH:mm') }}
              </template>
              <template v-slot:item.num="{ item }">
                <v-chip
                  class="ma-2"
                  :color="getColor(item.num)"
                  text-color="white"
                >
                  {{Number(item.num).toFixed(1)}}
                </v-chip>
              </template>
            </v-data-table>
            <div class="text-center pa-4">
              <v-pagination v-model="normal.options.page" :length="normal.pageCount" :total-visible="10" @input="next"></v-pagination>
            </div>
          </div>
        </v-tab-item>

        <v-tab-item :value="'PersonInfo'" class="tab_bg">
           <v-card class='pa-10' align='center'>
            <h2>个人体温轨迹</h2>
            <img class="qr-code" alt="qrcode" :src="qrcode">
          </v-card>
        </v-tab-item>

      </v-tabs-items>

    </div>

  </div>
</template>

<script>
import ScatterChart from '../components/ScatterChart.vue'
import { getDayRang } from '../components/chartOption'
import generateQRCode from '@/utils/generateQRCode'

export default {
  name: 'TemperatureData',
  data () {
    return {
      qrcode: '',
      normal: {
        timeTab: 'daily',
        desserts: [],
        options: {
          page: 1,
          offset: 0,
          limit: 10,
          start_time: 0,
          end_time: 0,
          user_no: '',
          id_num: '',
          name: '',
          num: 0
        },
        tempRange: [
          { state: '不限', temp: '0' },
          { state: '大于37度', temp: '37' },
          { state: '38度', temp: '38' },
          { state: '39度', temp: '39' }
        ],
        pageCount: 0
      },
      abnormal: {
        desserts: [],
        options: {
          page: 1,
          offset: 0,
          limit: 10,
          start_time: 0,
          end_time: 0,
          user_no: '',
          id_num: '',
          name: '',
          num: 37.6
        },
        pageCount: 0,
        chartsData: [],
        time: 1
      },
      loading: false,
      tab: 'Anomalies',
      downloads: {},
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id'
        },
        { text: '姓名', value: 'name', sortable: false },
        { text: '身份证号', value: 'id_num', sortable: false },
        { text: '公司名称', value: 'company', sortable: false },
        { text: '采集日期', value: 'created_at', sortable: false },
        { text: '联系电话', value: 'mobile', sortable: false },
        { text: '体温指数', value: 'num', sortable: false }
      ]
    }
  },
  chartsTimer: 0,
  components: {
    ScatterChart
  },
  mounted () {
    this.getAbnormalPersonnelList()
    this.getChartsData()
    console.log(location)
    const qrCodeURL = location.hostname.includes('test')
      ? 'http://mtest-temperature.***.com'
      : 'http://m-temperature.***.com'
    this.showQRCode(qrCodeURL)
  },
  beforeDestroy () {
    clearTimeout(this.chartsTimer)
  },
  methods: {
    async showQRCode (qrUrl) {
      this.qrcode = await generateQRCode(qrUrl)
    },
    tabChange (tab) {
      if (tab === 'Info') {
        this.getTemperatureLists()
        clearTimeout(this.chartsTimer)
      } else {
        this.getAbnormalPersonnelList()
        this.getChartsData()
      }
    },
    getColor (num) {
      if (num > 37.5) return 'red'
      else return 'blue'
    },
    setQuery () {
      const path = this.$router.path
      this.$router.replace({ path, query: this.normal.options })
    },
    nextAbnormal (page) {
      // console.log('page', page)
      this.abnormal.options.page = page
      this.abnormal.options.offset = (page - 1) * 10
      // this.setQuery(this.options)
      this.getAbnormalPersonnelList()
    },
    next (page) {
      // console.log('page', page)
      this.normal.options.page = page
      this.normal.options.offset = (page - 1) * 10
      // this.setQuery(this.options)
      this.getTemperatureLists()
      // this.getPersonnelList()
    },
    async getAbnormalPersonnelList () {
      try {
        this.loading = true
        const res = await this.$Api.getTemperatureList({ ...this.abnormal.options })
        if (res) {
          // console.log(res)
          this.abnormal.desserts = res.data.data
          this.abnormal.pageCount = Math.ceil(res.data.total / 10)
        } else {
          // this.snackbarText = res.msg
        }
      } catch (e) {
        // this.snackbarText = e
      } finally {
        this.loading = false
      }
    },
    async getTemperatureLists () {
      try {
        this.loading = true
        const timeRang = getDayRang(this.normal.timeTab === 'daily' ? 1 : 7)
        this.normal.options.start_time = timeRang[0]
        this.normal.options.end_time = timeRang[1]
        const res = await this.$Api.getTemperatureList({ ...this.normal.options })
        if (res) {
          // console.log(res)
          this.normal.desserts = res.data.data
          this.normal.pageCount = Math.ceil(res.data.total / 10)
        } else {
          // this.snackbarText = res.msg
        }
      } catch (e) {
        // this.snackbarText = e
      } finally {
        this.loading = false
      }
    },
    changeTime (time) {
      this.abnormal.time = time
      this.getChartsData()
    },
    async getChartsData () {
      clearTimeout(this.chartsTimer)
      const timeRang = getDayRang(this.abnormal.time)
      try {
        const options = {
          page: 1,
          offset: 0,
          limit: 10000,
          start_time: timeRang[0],
          end_time: timeRang[1],
          user_no: '',
          id_num: '',
          name: '',
          num: 37.6
        }
        this.loading = true
        const res = await this.$Api.getTemperatureList(options)
        if (res) {
          this.abnormal.chartsData = res.data.data
        } else {
          // this.snackbarText = res.msg
        }
      } catch (e) {
      } finally {
        this.loading = false
      }
      this.chartsTimer = setTimeout(() => {
        this.getChartsData()
      }, 5000)
    },
    tempChange () {
      this.normal.options.page = 1
      this.normal.options.offset = 0
      this.getTemperatureLists()
    }
  }
}
</script>

<style>
.temp_img {
  width: 50px;
  height: 50px;
}
.tab_bg {
  background:rgba(245,246,250,1);
}
</style>
