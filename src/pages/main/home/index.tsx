import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx'
import { UserStore } from 'src/stores/modules/user'
import { RouteComponentProps } from 'react-router';
import { message } from 'antd'
import LineBarChart from './components/line_bar_chart'
import PieChart from './components/pie_chart'
import Card from './components/card'
import { HomeService } from 'src/services/home'

interface HomePorps extends RouteComponentProps {
  userStore: UserStore
}

@inject('userStore', 'homeService')
@observer
export default class Home extends React.Component<HomePorps, {}> {  

  public userStore: UserStore
  public echarts: any
  public myecharts: any
  public homeService: HomeService
  @observable public dayData: any[]
  @observable public weekData: any[]
  @observable public monthData: any[]
  @observable  public cardsData: any

  constructor (props: any) {
    super(props)
    this.userStore = props.userStore
    this.homeService = props.homeService

  }
  
  public componentDidMount () {
    this.getStatCards()
  }

  public async getStatCards() {
    const res: any = await this.homeService.getStatCards()
    if (res.status === 0) {
      this.cardsData = res.data
      this.dayData = [
        {value: res.data.today_qs.value, name: '秋水广场'},
        {value: res.data.today_by.value, name: '八一广场'},
      ]
      this.weekData = [
        {value: res.data.current_week_qs, name: '秋水广场'},
        {value: res.data.current_week_by, name: '八一广场'},
      ]
      this.monthData = [
        {value: res.data.current_month_qs, name: '秋水广场'},
        {value: res.data.current_month_by, name: '八一广场'},
      ]
    } else {
      message.error(res.msg || '操作失败')
    }
  }
  public render () {
    const cardsData = this.cardsData
    return (
      <div className="home-main">
        <div className="board-wrapper">
          <div className="border-title">采集量指标卡</div>
          {
            cardsData ? 
            <div className="chart-wrapper card-container">
              <Card title={'本月采集量'} 
              value={cardsData.current_month.value} 
              lastValue={cardsData.current_month.last_value}></Card>
              <Card title={'本周采集量'}
              value={cardsData.current_week.value} 
              lastValue={cardsData.current_week.last_value}></Card>
              <Card title={'今日采集量'}
              value={cardsData.today.value} 
              lastValue={cardsData.today.last_value}></Card>
              <Card title={'近三日采集量'}
              value={cardsData.last_three_days.value} 
              lastValue={cardsData.last_three_days.last_value}></Card>
              <Card title={'今日八一广场采集量'}
              value={cardsData.today_by.value} 
              lastValue={cardsData.today_by.last_value}></Card>
              <Card title={'今日秋水广场采集量'}
              value={cardsData.today_qs.value} 
              lastValue={cardsData.today_qs.last_value}></Card>
            </div>
            : ''
          }
        </div>
        <div className="board-wrapper important-place">
          <div className="border-title">重点区域采集对比</div>
          <div className="chart-wrapper top-right">
            <div className="pie left-pie">
              <div className="pie-charts">
                <div className="day">
                  <PieChart type={'day'} statData={this.dayData}></PieChart>
                </div>
                <div className="week">
                  <PieChart type={'week'} statData={this.weekData}></PieChart>
                </div>
                <div className="month">
                  <PieChart type={'month'} statData={this.monthData}></PieChart>
                </div>
              </div>
              <div className="pie-point">
                <span>
                  <i className="qs"></i>秋水广场
                </span>
                <span>
                  <i className="by"></i>八一广场
                </span>
              </div>
            </div>
            <div className="pie right-pie">
              <div className="pie-charts">
                <PieChart type={'range'} statData={[]}></PieChart>
              </div>
              <div className="pie-point">
                <span>
                  <i className="qs"></i>秋水广场
                </span>
                <span>
                  <i className="by"></i>八一广场
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="board-wrapper">
          <div className="border-title">采集数据趋势分析</div>
          <div className="chart-wrapper">
            <LineBarChart type={'line'} serviceType={'traffic'} isShowPlaceFilter={false}></LineBarChart>
          </div>
        </div>
        <div className="board-wrapper">
          <div className="border-title">归属地分析</div>
          <div className="chart-wrapper">   
          <LineBarChart type={'bar'} serviceType={'cityCount'} isShowPlaceFilter={true}></LineBarChart>
          </div>
        </div>
        <div className="board-wrapper bottom">
          <div className="border-title">设备采集数据分析</div>
          <div className="chart-wrapper">
          <LineBarChart type={'bar'} serviceType={'deviceCount'} isShowPlaceFilter={false}></LineBarChart>
          </div>
        </div>
      </div>
    )
  }
}