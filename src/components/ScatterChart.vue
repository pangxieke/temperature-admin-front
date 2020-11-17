<template>
  <div class="charts-container">
    <div ref="charts" id="charts" style="height: 400px"></div>
    <v-select
      :items="times"
      @change="change"
      :value="time"
      item-text="text"
      item-value="value"
      outlined
      dense
      class="select"
    ></v-select>
  </div>
</template>

<script>
import chartOption, { getDayRang } from './chartOption'
import echarts from 'echarts'
import dayjs from 'dayjs'

export default {
  name: 'ScatterChart',
  props: {
    value: Array,
    time: Number
  },
  data () {
    return {
      times: [
        { value: 1, text: '今日' },
        { value: 7, text: '七日' },
        { value: 30, text: '一个月' }
      ]
    }
  },
  charts: null,
  mounted () {
    this.$nextTick(() => {
      this.drawChart(this.value)
    })
  },
  watch: {
    value (newVal) {
      this.drawChart(newVal)
    }
  },
  methods: {
    change (value) {
      this.$emit('change-time', value)
    },
    drawChart (data) {
      this.charts = echarts.init(this.$refs.charts)
      const option = chartOption()
      option.dataset.source = data || []
      const day = getDayRang(this.time)
      option.xAxis[0].min = day[0]
      option.xAxis[0].max = day[1]
      const dayRang = day.map(item => dayjs(item * 1000).format('YYYY-MM-DD'))
      option.title.text = this.time === 1 ? dayRang[0] : dayRang.join('   -  ')
      if (this.time === 1) {
        option.xAxis[0].axisLabel.formatter = (value) => {
          return dayjs(value * 1000).format('HH:mm')
        }
      }
      this.charts.setOption(option)
    }
  }
}
</script>

<style  lang="scss" scoped >
.charts-container {
  position: relative;
  .select {
    position: absolute;
    top: 5px;
    right: 7%;
  }
}
</style>
