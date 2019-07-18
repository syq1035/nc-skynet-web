import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx'
import { DatePicker, message } from 'antd'
import Options from 'src/utils/bar_option'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import { HomeService } from 'src/services/home'

interface LineBarChartProps {
  type: string,
  statData: any[]
}
interface ActiveObj {
  value: string,
  name: string
}
@inject('echarts', 'homeService')
@observer
export default class LineBarChart extends React.Component<LineBarChartProps, {}> {  
  public homeService: HomeService
  public echarts: any
  public echartsInstance: any
  public chartRef: React.RefObject<any>
  public startMoment: any
  public endMoment: any
  public startFormat: string
  public endFormat: string
  public type: string
  public SData: any[]
  @observable public activeObj: ActiveObj

  constructor (props: any) {
    super(props)
    this.homeService = props.homeService
    this.echarts = props.echarts
    this.type = props.type
    this.chartRef = React.createRef()
    if (this.type === 'range') {
      this.endMoment = moment()
      this.initStartMoment()
      this.startFormat = this.startMoment.format('YYYY/MM/DD HH')
      this.endFormat = this.endMoment.format('YYYY/MM/DD HH')
    } 
  }
  public initStartMoment () {
    if (this.type === 'month') {
      this.startMoment = moment().startOf('month')
    } else if (this.type === 'week') {
      this.startMoment = moment().startOf('isoWeek')
    } else {
      this.startMoment = moment().startOf('day')
    }
    
  }
  public componentDidMount () {
    if (this.type === 'range') {
      this.getChartsData()
    } 
  }
  public componentWillReceiveProps(nextProps: any) {
    if (this.type !== 'range' && nextProps.statData) {
      this.SData = nextProps.statData
      this.formatActiveObj()
      this.drawEcharts(this.SData)
    }
  }
  public async getChartsData  () {
    const res: any = await this.homeService.getAreaCount({
      start: this.startMoment.valueOf(),
      end: this.endMoment.valueOf()
    })
    if (res.status === 0) {
      
     const byCount = res.data.by.count
     const qsCount = res.data.qs.count
     this.SData = [
      {value: qsCount, name: '秋水广场'},
      {value: byCount, name: '八一广场'},
    ]

     this.formatActiveObj()
     this.drawEcharts(this.SData)
    } else {
      message.error(res.msg || '操作失败')
    }
  }
  public formatActiveObj () {
    const SData: any[] = [...this.SData]
    SData.sort((a: any, b: any): number => {
      if (a.value > b.value) {
       return  -1
      } else {
       return 1
      }
    })
    console.log('SData', SData)
    const total = SData[0].value + SData[1].value
    this.activeObj = {
      value: (100 * SData[0].value / total).toFixed(2) + '%',
      name: SData[0].name
    } 
  }
  public drawEcharts (SData: any) {
    this.echartsInstance = this.echarts.init(this.chartRef.current);
    const option: any = JSON.parse(JSON.stringify(Options.getOptions('pie')))
    option.series[0].data = SData
    this.echartsInstance.setOption(option)
  }
  public onOk = (value: any) => {
    const [startMoment, endMoment] = value
    this.startMoment = startMoment
    this.endMoment = endMoment
    this.getChartsData()
  }
  public render () {
    return (
      <div className="chart-main">
        {
          this.type === 'range' ? 
          <div className="time">
            <div>自定义时间段</div>
            <DatePicker.RangePicker
              size="small"
              defaultValue={[moment(this.startFormat, 'YYYY/MM/DD HH'), moment(this.endFormat, 'YYYY/MM/DD HH' )]}
              className="time-range"
              showTime={{ format: 'HH' }}
              format="YYYY-MM-DD HH"
              locale={locale}
              placeholder={['开始日期', '结束日期']}
              onOk={this.onOk}
            />
          </div>
          :
           <div className="time">
            <span className="text">{this.type === 'day' ? '今日' : this.type === 'week' ? '本周' : '本月'}</span>
          </div> 
        }
        <div className="chart-content" >
          <div className="chart" ref={this.chartRef}></div>
          {
            this.activeObj ? 
            <div className="large">
              <span>{this.activeObj.value}</span>
              <span>{this.activeObj.name}</span>
            </div> 
            : null
          } 
        </div>
      </div>
    )
  }
}