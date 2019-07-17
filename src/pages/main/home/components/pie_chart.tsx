import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
import { DatePicker } from 'antd'
import locale from 'antd/lib/date-picker/locale/zh_CN';
// import moment from 'moment';
import Options from 'src/utils/bar_option'

interface LineBarChartProps {
  SData: any[],
  type: string
}

@inject('echarts')
@observer
export default class LineBarChart extends React.Component<LineBarChartProps, {}> {  

  public userStore: UserStore
  public echarts: any
  public echartsInstance: any
  public chartRef: HTMLDivElement | null

  constructor (props: any) {
    super(props)
    this.echarts = props.echarts
  }
 
  public componentDidMount () {
    const {SData} = this.props
    this.echartsInstance = this.echarts.init(this.chartRef);
    const pie: any = JSON.parse(JSON.stringify(Options.getOptions('pie')))
    pie.series[0].data = SData
    this.echartsInstance.setOption(pie);
  }

  public render () {
    const {type} = this.props
    return (
      <div className="chart-main">
        {
          type === 'range' ? 
          <div className="time">
            <div>自定义时间段</div>
            <DatePicker.RangePicker
              size="small"
              className="time-range"
              showTime={{ format: 'HH' }}
              format="YYYY-MM-DD HH"
              locale={locale}
              placeholder={['开始日期', '结束日期']}
            />
          </div>
          :
           <div className="time">
            <span className="text">{type === 'day' ? '今日' : type === 'week' ? '本周' : '本月'}</span>
          </div> 
        }
        <div className="chart-content" ref={(ref) => { this.chartRef = ref }}></div>
      </div>
    )
  }
}