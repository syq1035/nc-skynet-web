import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
import { RouteComponentProps } from 'react-router';
// import { DatePicker } from 'antd'
// import locale from 'antd/lib/date-picker/locale/zh_CN';
// import moment from 'moment';
// import { HomeService } from 'src/services/home'

@inject('homeService')
@observer
export default class ImportantArea extends React.Component<RouteComponentProps, {}> {  

  public userStore: UserStore

  constructor (props: any) {
    super(props)

  }

  public render () {
    return (
      <div className="area-main">
        <div className="operate">
          <div>八一广场</div>
          <div>秋水广场</div>
          <div className="time-filter">
            <div>自定义时间段</div>
            {/* <DatePicker.RangePicker
              size="small"
              defaultValue={[moment(this.startFormat, 'YYYY/MM/DD HH'), moment(this.endFormat, 'YYYY/MM/DD HH' )]}
              className="time-range"
              showTime={{ format: 'HH' }}
              format="YYYY-MM-DD HH"
              locale={locale}
              placeholder={['开始日期', '结束日期']}
              onOk={this.onOk} */}
            />
          </div>
        </div>
        <div className="area-map"></div>
      </div>
    )
  }
}