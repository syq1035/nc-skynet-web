import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
import { RouteComponentProps } from 'react-router';
import { Button } from 'antd';

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

  public componentDidMount () {
    this.myecharts = this.echarts.init(this.charts.current, 'halloween');
    this.myecharts.setOption({
      xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
      }]
  });
  }

  public render () {
    return (
      <div className="home-main">
        首页
        <Button type="primary">Primary</Button>
        <div className="charts" id="charts" ref={this.charts}></div>
      </div>
    )
  }
}