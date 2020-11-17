import dayjs from 'dayjs'
export default () => {
  return {
    title: {
      text: '体温记录',
      left: '2%',
      top: 5
    },
    grid: {
      left: '2%',
      right: '7%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      // trigger: 'axis',
      showDelay: 0,
      formatter: function (params) {
        return `姓名：${params.data.name}<br/>
                温度：${params.data.num}℃<br/>
                时间：${dayjs(params.data.created_at * 1000).format('YYYY-MM-DD HH:mm')}`
      },
      axisPointer: {
        show: false,
        type: 'cross',
        lineStyle: {
          type: 'dashed',
          width: 1
        }
      }
    },
    brush: {},
    legend: {
      left: 'center'
    },
    toolbox: {
      show: false
    },
    // dataZoom: [
    //   {
    //     id: 'dataZoomX',
    //     type: 'inside',
    //     xAxisIndex: [0],
    //     filterMode: 'none'
    //   },
    //   {
    //     id: 'dataZoomY',
    //     type: 'inside',
    //     yAxisIndex: [0],
    //     filterMode: 'none'
    //   }
    // ],
    xAxis: [
      {
        type: 'time',
        scale: true,
        axisLabel: {
          formatter: (value) => {
            return dayjs(value * 1000).format('YYYY-MM-DD HH:mm')
          },
          color: 'rgba(43, 48, 52, 0.6)',
          margin: 20
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(43, 48, 52, 0.6)'
          }
        },
        minorTick: {
          show: true
        },
        axisPointer: {
          show: true,
          type: 'line',
          label: {
            formatter: (params) => {
              return dayjs(params.value * 1000).format('YYYY-MM-DD HH:mm')
            }
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            type: 'dashed'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        max: 41,
        min: 36,
        scale: true,
        lineStyle: {
          type: 'line'
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(43, 48, 52, 0.6)'
          }
        },
        axisPointer: {
          show: true,
          type: 'line',
          label: {
            formatter: (value) => {
              return value.value.toFixed(1) + '℃'
            }
          }
        },
        axisLabel: {
          formatter: (value, index) => {
            return value + '℃'
          },
          color: 'rgba(43, 48, 52, 0.6)',
          margin: 20
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      }
    ],
    dataset: {
      // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
      // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
      source: []
    },
    series: {
      type: 'scatter',
      dimensions: ['created_at', 'num'],
      encode: {
        x: 'created_at',
        y: 'num'
      },
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.5,
          colorStops: [{
            offset: 0, color: '#FF5653' // 0% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      emphasis: {
        label: {
          show: false,
          position: 'right',
          color: 'blue',
          fontSize: 16
        },
        formatter: (value) => {
          return value
        }
      }
    }
  }
}

export function getDayRang (time) {
  return [dayjs().startOf('day').subtract(time - 1, 'd').unix(), dayjs().endOf('day').unix()]
}
