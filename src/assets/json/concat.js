const echarts = require('echarts')

const concat = {
  barOptions: {
    title: {
      // text: '省外',
      textStyle: {
        color: '#fff',
        fontSize: 16
      }
    },
    textStyle: {
      color: '#fff'
    },
    tooltip: {},
    grid: {
      top: 30,
      bottom: 25,
      left: 40,
      right: 10
    },
    xAxis: {
      // data: ["聚集市","开始市","四欧派","我司多","那是肯","是是多","快快快"],
      axisTick: {
        show: false
      },
      axisLabel:{
        rotate:45,//倾斜度 -90 至 90 默认为0
        margin:12,
        align:'center',
        fontSize:10
      },
      axisLine: {
        lineStyle: {
          color: '#0f386e'
        }
      },
      splitLine: {
        show: true,
        lineStyle:{
          color: ['#0f386e'],
          width: 1,
          type: 'solid'
        }
      }
    },
    legend: {
      show: false
    },
    yAxis: {
      show: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#0f386e'
        }
      },
      splitLine: {
        show: true,
        lineStyle:{
          color: ['#0f386e'],
          width: 1,
          type: 'solid'
        }
      }
    },
    series: [
      {
        type: 'bar',
        // data: [12.5, 11, 23, 32, 22, 15, 14],
        barWidth: '30%',
        label: {
          show: false,
          fontSize: 10,
          position: 'top'
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#2F82FF'
              },{
                offset: 1,
                color: 'rgba(0, 194, 255, 0.2)'
              }
            ]),
            barBorderRadius: [3, 3, 0, 0]
          }
        }
      }
    ]
  },
  lineOptions: {
    title: {
      // text: '人员流入趋势图',
      textStyle: {
        color: '#fff',
        fontSize: 16
      }
    },
    tooltip : {
      trigger: 'axis'
    },
    grid: {
      top: 30,
      bottom: 25,
      left: 40,
      right: 10
    },
    textStyle: {
      color: '#fff'
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      // data: ['10月11日', '10月12日', '10月13日', '10月14日', '10月15日', '10月16日', '10月17日'],
      axisTick: {
        show: true
      },
      axisLine: {
        lineStyle: {
          color: '#0f386e'
        }
      },
      axisLabel:{
        rotate:30,//倾斜度 -90 至 90 默认为0
        margin:12,
        align:'center',
        fontSize:10,
        // interval:0 //横轴信息全部显示
      },
      splitLine: {
        show: true,
        lineStyle:{
          color: ['#0f386e'],
          width: 1,
          type: 'solid'
        }
      }
    },
    yAxis: {
      // show:false,
      type: 'value',
      // interval: 20,
      axisTick: {
        show: true
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#0f386e'
        }
      },
      splitLine: {
        show: true,
        lineStyle:{
          color: ['#0f386e'],
          width: 1,
          type: 'solid'
        }
      }
    },
    series: [{
      // data: [55, 61, 59, 62, 54, 67, 66],
      type: 'line',
      // symbol: 'none',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
              offset: 0, color: 'rgba(0, 194, 255, 0.1)' // 0% 处的颜色
          }, {
              offset: 1, color: 'rgba(47, 130, 255, 0.6)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      },
      lineStyle: {
        color: '#7DB1FF'
      }
    }]
  },
  pieOptions: {
    title: {
      text: '',
      textStyle: {
        color: '#fff',
        fontSize: 16,
      },
    },
    textStyle: {
      color: '#fff'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} <br> 数量: {c} 人 <br> 占比: {d}%',
      position:['50%','50%'],
      // extraCssText:'width:1.5rem; height:1rem; background:#2F82FF; padding: .1rem;'
    },
    color:['#153797', '#2d63ff'],
    series: [
      {
        // name: '外地/本地',
        type:'pie',
        radius: ['70%', '90%'],
        center : ['50%', '50%'],
        avoidLabelOverlap: false,
        hoverAnimation: false,
        label: {
            normal: {
              show: false,
              position: 'center',
              // textStyle: {
              //   fontSize: '10',
              //   fontWeight: 100
              // },
              // formatter: '{a}'
            },
            emphasis: {
                show: false,
                position: 'center',
                textStyle: {
                    fontSize: '10',
                    fontWeight: 'bold'
                },
                formatter: '{b}: 占比{d}%'
            }
        },
        labelLine: {
            normal: {
                show: true
            }
        },
        // data:[
        //   {value:335, name:'直接访问'},
        //   {value:310, name:'邮件营销'},
        // ]
      }
    ]
  },
  mapOptions: {
    tooltip: {},
    grid: {
      right: 0,
      left: 0,
      bottom: 0,
      top:0
    },
    xAxis: {
      type: 'category',
      show: false,
      data: []
    },
    yAxis: {
      type: 'category',
      show: false,
      data: []
    },
    visualMap: {
      show: false,
      type: 'piecewise',
      min: 0,
      // max: 60,
      calculable: true,
      realtime: false,
      // splitNumber: 6,
      inRange: {
        color: ['#34D1FF', '#62FF8E', '#C4FF47', '#FFF73C']
      }
    },
    series: [{
      // name: '聚集度',
      type: 'heatmap',
      data: [],
      itemStyle: {
        emphasis: {
          borderColor: '#333',
          borderWidth: 1
        }
      },
    }]
},
}

export default concat
