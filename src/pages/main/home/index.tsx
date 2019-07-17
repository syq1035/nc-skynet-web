import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
import { RouteComponentProps } from 'react-router';
// import { DatePicker } from 'antd'
// import locale from 'antd/lib/date-picker/locale/zh_CN';
import LineBarChart from './components/line_bar_chart'
import PieChart from './components/pie_chart'

import themeData from 'src/assets/json/halloween.json'

interface HomePorps extends RouteComponentProps {
  userStore: UserStore
}

@inject('userStore', 'echarts')
@observer
export default class Home extends React.Component<HomePorps, {}> {  

  public userStore: UserStore
  public charts: React.RefObject<any>
  public echarts: any
  public myecharts: any

  constructor (props: any) {
    super(props)
    this.userStore = props.userStore
    this.echarts = props.echarts
    this.charts = React.createRef()
    this.echarts.registerTheme('halloween', themeData)

  }
  public onDateChange(value: any, dateString: [string, string]) {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }
  
  public onOk(value: any) {
    console.log('onOk: ', value);
  }
  public componentDidMount () {
    //
  }

  public render () {
    return (
      <div className="home-main">
        <div className="board-wrapper card-container">
          <div className="card down">
            <div className="card-title">本月采集量</div>
            <div className="card-total">3075</div>
            <div className="card-rate">
              <div className="text">环比</div>
              <div className="rate">
                <i className="arrow"></i>
                <span className="num">-78%</span>
              </div>
            </div>
          </div>
          <div className="card up">
            <div className="card-title"></div>
            <div className="card-total"></div>
            <div className="card-rate">
              <div className="text"></div>
              <div className="rate">
                <i className="arrow"></i>
                <span className="num">78%</span>
              </div>
            </div>
          </div>
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
        </div>
        <div className="board-wrapper important-place">
          <div className="border-title">重点区域采集对比</div>
          <div className="chart-wrapper top-right">
            <div className="pie left-pie">
              {/* <div className="time">
                <span className="text">今日</span>
                <span className="text">本周</span>
                <span className="text">本月</span>
              </div> */}
              <div className="pie-charts">
                <div className="day">
                  <PieChart type={'day'} SData={[
                    {value: 335, name: '直接访问'},
                    {value: 310, name: '邮件营销'}
                  ]}></PieChart>
                </div>
                <div className="week">
                <PieChart type={'week'}  SData={[
                    {value: 35, name: '直接访问'},
                    {value: 310, name: '邮件营销'}
                  ]}></PieChart>
                </div>
                <div className="month">
                <PieChart type={'month'}  SData={[
                    {value: 355, name: '直接访问'},
                    {value: 10, name: '邮件营销'}
                  ]}></PieChart>
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
              {/* <div className="time">
                <div>自定义时间段</div>
                <DatePicker.RangePicker
                  // style={this.timeRagneStyle}
                  size="small"
                  className="time-range"
                  showTime={{ format: 'HH' }}
                  format="YYYY-MM-DD HH"
                  locale={locale}
                  placeholder={['开始日期', '结束日期']}
                  onChange={this.onDateChange}
                  onOk={this.onOk}
                />
              </div> */}
              <div className="pie-charts">
                <PieChart type={'range'}SData={[
                    {value: 355, name: '直接访问'},
                    {value: 310, name: '邮件营销'}
                  ]}></PieChart>
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
          {/* <LineBarChart type={'bar'} serviceType={'cityCount'} isShowPlaceFilter={false}></LineBarChart> */}
          </div>
        </div>
        <div className="board-wrapper bottom">
          <div className="border-title">设备采集数据分析</div>
          <div className="chart-wrapper">
          {/* <LineBarChart type={'bar'} serviceType={'deviceCount'} isShowPlaceFilter={false}></LineBarChart> */}
          </div>
        </div>
      </div>
    )
  }
}