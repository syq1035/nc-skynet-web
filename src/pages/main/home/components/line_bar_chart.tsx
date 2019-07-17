import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx'
import Options from 'src/utils/bar_option'

import { DatePicker, Breadcrumb, message } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import { HomeService } from 'src/services/home'

interface LineBarChartProps {
  isShowPlaceFilter: boolean,
  type: string,
  serviceType: string
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
  public interval: string
  public XData: any[]
  public SData: any[]
  public serviceType: string
  @observable public chooseProvince: string = ''

  constructor (props: any) {
    super(props)
    this.homeService = props.homeService
    this.echarts = props.echarts
    this.serviceType = props.serviceType
    this.chartRef = React.createRef()
    this.startMoment = moment().startOf('day')
    this.endMoment = moment()
    if (this.props.serviceType === 'traffic') {
      this.interval = 'hour'
    }  
  }
  public componentDidMount () {
    
    this.getChartsData()
    window.onresize = () => {
      if (this.serviceType === 'deviceCount') {
        const {XData, SData} = this.getTrunkDeviceData()
        this.drawEcharts(XData, SData)
      } 
      this.echartsInstance.resize()       
    }
  }
  public async getChartsData () {
    const { serviceType } = this.props
    const res: any = await this.homeService[serviceType]({
      start: this.startMoment.valueOf(),
      end: this.endMoment.valueOf(),
      interval: serviceType === 'traffic' ? this.interval : undefined,
      province: serviceType === 'cityCount' ? this.chooseProvince : undefined
    })
    if (res.status === 0) {
      this.XData = Object.keys(res.data)
      this.SData = Object.values(res.data)
      if (serviceType === 'deviceCount') {
        const {XData, SData} = this.getTrunkDeviceData()
        this.drawEcharts(XData, SData)
        return 
      }
      if ( serviceType === 'traffic' && (this.interval === 'hour' || this.interval === 'day')) {
        this.XData = this.XData.map((item) => {
          return item.slice(5)
        })
      } 
      this.drawEcharts(this.XData, this.SData)
    } else {
      message.error(res.msg || '操作失败')
    }
  }
  public getTrunkDeviceData (): any {
    let XData = this.XData
    let SData = this.SData
    const len = this.chartRef.current.clientWidth / 20
    if (this.XData.length > len) {
      XData = []
      SData = []
      const range: any = (this.XData.length / len).toFixed()
      let i: number = 0
      while (i < len) {
        XData.push(this.XData[i * range])
        SData.push(this.SData[i * range])
        i++
      }
    }
    return {XData, SData}
  }
  public drawEcharts (XData: any, SData: any) {
    const {type} = this.props
    this.echartsInstance = this.echarts.init(this.chartRef.current);
    const option: any = JSON.parse(JSON.stringify(Options.getOptions(type)))
    option.xAxis.data = XData
    option.series[0].data = SData
    this.echartsInstance.setOption(option)
    if (this.serviceType === 'cityCount' && !this.chooseProvince) {
      this.echartsInstance.on('click', (params: any) => {
        this.chooseProvince = params.name
        this.getChartsData()
      })
    }
  }
  public showAllProvince = () => {
    this.chooseProvince = ''
    this.getChartsData()
  }
  public getInterval(startMoment: any, endMoment: any) {
    const interval = this.endMoment.valueOf() - this.startMoment.valueOf()
    const diffMonth: any = endMoment.diff(startMoment, 'months') 
    const diffYear: any = endMoment.diff(startMoment, 'year') 
    if (interval < 2 * 3600 * 1000) {
      return 'minute'
    } else if (interval < 2 * 24 * 3600 * 1000) {
      return 'hour'
    } else if ( diffMonth < 2 ) {
      return 'day'
    } else if ( diffYear < 2 ) {
      return 'month'
    } else {
      return 'year'
    }
  }
  public onOk = (value: any) => {
    const [startMoment, endMoment] = value
    this.startMoment = startMoment
    this.endMoment = endMoment
    if (this.props.serviceType === 'traffic') {
      this.interval = this.getInterval(startMoment, endMoment)
    }
    
    this.getChartsData()
  }
  public render () {
    const { isShowPlaceFilter } = this.props
    const startFormat = this.startMoment.format('YYYY/MM/DD HH')
    const endFormat = this.endMoment.format('YYYY/MM/DD HH')
    return (
      <div className="chart-main">
        <div className="filter">
          <div className="time-filter">
            自定义时间段
            <DatePicker.RangePicker
              size="small"
              defaultValue={[moment(startFormat, 'YYYY/MM/DD HH'), moment(endFormat, 'YYYY/MM/DD HH' )]}
              className="time-range"
              showTime={{ format: 'HH' }}
              format="YYYY-MM-DD HH"
              locale={locale}
              placeholder={['开始日期', '结束日期']}
              onOk={this.onOk}
            />
          </div>
          {
            isShowPlaceFilter ?
            <div className="place-filter">
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <span onClick={this.showAllProvince}>全国</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <span>{this.chooseProvince}</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div> : ''
          }
        </div>
        <div className="chart-content" ref={this.chartRef}></div>
      </div>
    )
  }
}