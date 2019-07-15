import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
// import { RouteComponentProps } from 'react-router';
// import themeData from 'src/assets/json/halloween.json'
import Options from 'src/utils/bar_option'

interface LineBarChartProps {
  SData: any[]
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
    return (
      <div className="chart-main">
        <div className="chart-content" ref={(ref) => { this.chartRef = ref }}></div>
      </div>
    )
  }
}