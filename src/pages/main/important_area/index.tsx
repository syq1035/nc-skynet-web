import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { DatePicker } from 'antd'
import { observable } from 'mobx'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import { HomeService } from 'src/services/home'
import gis from 'src/utils/map_config.js'

@inject('homeService')
@observer
export default class ImportantArea extends React.Component<RouteComponentProps, {}> {  
  public homeService: HomeService
  public mapRef: React.RefObject<any>
  public startMoment: any
  public endMoment: any
  public startFormat: string
  public endFormat: string
  @observable public type: string = 'by'

  constructor (props: any) {
    super(props)
    this.homeService = props.homeService
    this.mapRef = React.createRef()
    this.startMoment = moment().startOf('day')
    this.endMoment = moment()
    this.startFormat = this.startMoment.format('YYYY/MM/DD HH')
    this.endFormat = this.endMoment.format('YYYY/MM/DD HH')
  }
  public onOk = (value: any) => {
    const [startMoment, endMoment] = value
    this.startMoment = startMoment
    this.endMoment = endMoment
    this.getMapData('update')
  }
  public componentDidMount () {
    this.getMapData()
    this.initMap()
  }
  public tabChange = (type: string) => {
    this.type = type
    gis.setCenter(type)
  }
  public initMap() {
    gis.wh_gis_init(this.type, this.mapRef.current)
    // gis.wh_gis_init(this.type, 'areaMap')
    // gis.test('areaMap')
  }
  public getMapData(type: string = '') {
    this.drawHeatMap(type)
    this.drawHotArea(type)
  }
  public drawHeatMap(type: string = '') {
    if (type === 'update') {
      gis.removeMapvLayer()
    }
    this.homeService
      .getCoord({
        start: this.startMoment.valueOf(),
        end: this.endMoment.valueOf()
      })
      .then((res: any) => {
        if (res.status === 0) {
          gis.drawHeatMap(res.data)
        }
      });
  }
  public drawHotArea(type: string = '') {
    if (type === 'update') {
      gis.removeGeoLayer()
    }
    this.homeService.getAreaCount().then(res => {
      if (res.status === 0) {
        gis.drawArea(res.data)
      }
    })
  }
  public render () {
    return (
      <div className="area-main">
        <div className="operate">
          <div className="tab-btn">
            <span onClick={this.tabChange.bind(this, 'by')} className={this.type === 'by' ? 'active' : ''}>八一广场</span>
            <span onClick={this.tabChange.bind(this, 'qs')}className={this.type === 'qs' ? 'active' : ''}>秋水广场</span>
          </div>
          <div className="time-filter">
            <span>自定义时间段</span>
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
        </div>
        <div className="area-map" ref={this.mapRef} id="areaMap"></div>
      </div>
    )
  }
}