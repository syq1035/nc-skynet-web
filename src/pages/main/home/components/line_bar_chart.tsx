import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
// import { RouteComponentProps } from 'react-router';
// import themeData from 'src/assets/json/halloween.json'
import Options from 'src/utils/bar_option'

import { Select, Breadcrumb } from 'antd'

interface LineBarChartProps {
  isShowPlaceFilter: boolean,
  XData: any[],
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
    // this.echarts.registerTheme('halloween', themeData)
  }
 
  public componentDidMount () {
    const {XData, SData, type} = this.props
    // this.echartsInstance = this.echarts.init(this.chartRef, 'halloween');
    this.echartsInstance = this.echarts.init(this.chartRef);
    const option: any = JSON.parse(JSON.stringify(Options.getOptions(type)))
    option.xAxis.data = XData
    option.series[0].data = SData
    this.echartsInstance.setOption(option);
  }

  public render () {
    const { isShowPlaceFilter } = this.props
    return (
      <div className="chart-main">
        <div className="filter">
          <div className="time-filter">
            时间段
            <Select defaultValue="lucy" style={{ width: '1.5rem' }} >
              <Select.Option value="jack">Jack</Select.Option>
              <Select.Option value="lucy">Lucy</Select.Option>
              <Select.Option value="disabled" disabled>
                Disabled
              </Select.Option>
              <Select.Option value="Yiminghe">yiminghe</Select.Option>
            </Select>
          </div>
          {
            isShowPlaceFilter ?
            <div className="place-filter">
              <Breadcrumb separator=">">
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>
                  Application List
                </Breadcrumb.Item>
                <Breadcrumb.Item>An Application</Breadcrumb.Item>
              </Breadcrumb>
            </div> : ''
          }
        </div>
        <div className="chart-content" ref={(ref) => { this.chartRef = ref }}></div>
      </div>
    )
  }
}