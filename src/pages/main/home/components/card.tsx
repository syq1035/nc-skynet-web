import * as React from 'react'
import { inject, observer } from 'mobx-react';

interface CardProps {
  title: string,
  value: number,
  lastValue: number
}

@inject()
@observer
export default class Card extends React.Component<CardProps, {}> {  

  constructor (props: any) {
    super(props)

  }
  get rate () {
    const {value, lastValue} = this.props
    if (lastValue > 0) {
      return (100 * (value - lastValue) / lastValue).toFixed(2)
    } 
    return '--'
  }
  get trendClass () {
    const {value, lastValue} = this.props
    if (value < lastValue) {
      return 'down'
    }
    return 'up'
  } 
  public render () {
    const {title, value} = this.props
    return (
      <div className={'card ' + this.trendClass}>
        <div className="card-title">{title}</div>
        <div className="card-total">{value}</div>
        <div className="card-rate">
          <div className="text">环比</div>
          <div className="rate">
            <i className="arrow"></i>
            <span className="num">{this.rate + '%'}</span>
          </div>
        </div>
      </div>
    )
  }
}