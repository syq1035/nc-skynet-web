import { DatePicker, Input, Button, Row, Col, Table } from 'antd';
import { observable } from 'mobx'
import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
import { RouteComponentProps } from 'react-router';
import { SearchService } from 'src/services/search'

const { RangePicker } = DatePicker;
@inject('searchService')
@observer
export default class Home extends React.Component<RouteComponentProps, {}> {
  public userStore: UserStore
  public searchService: SearchService
  
  @observable public tableData: any[]
  @observable public page: number = 1
  @observable public total: number
  @observable public pagination: any
  @observable public startImpTime: any = '2019-07-13'
  @observable public endImpTime: any = '2019-07-14'
  @observable public startCollectTime: any = '2019-07-13'
  @observable public endCollectTime: any = '2019-07-14'
  @observable public bts: any = '72086WIFI'

  public columns: any = [
    {
      title: '1/107项',
      dataIndex: 'id',
    },
    {
      title: '事件ID',
      dataIndex: 'sn',
    },
    {
      title: '设备ID',
      dataIndex: 'bts_id',
    },
    {
      title: '设备名称',
      dataIndex: 'bts_name',
    },
    {
      title: '前台序列号',
      dataIndex: 'adivision',
    },
    {
      title: 'MAC',
      dataIndex: 'mac',
    },
    {
      title: '坐标',
      dataIndex: 'lat',
    },
    {
      title: '采集时间',
      dataIndex: 'collect_time',
    },
    {
      title: '入库时间',
      dataIndex: 'imp_time',
    }
  ];

  public data: any = [
    {
      id: 1111111,
      eventID: 111111,
      deviceID: 111111,
      deviceName: 'aaa',
      serialNum: 333333,
      mac: 555555,
      zb: '1,3',
      pickTime: '2019.2.3',
      storageTime: '2019.4.3'
    },
    {
      id: 1111111,
      eventID: 111111,
      deviceID: 111111,
      deviceName: 'aaa',
      serialNum: 333333,
      mac: 555555,
      zb: '1,3',
      pickTime: '2019.2.3',
      storageTime: '2019.4.3'
    }
  ]
  public state: any = {
    selectedRowKeys: []
  }

  public searchData = async () => {
    this.tableData = []
    const res: any = await this.searchService.getList({
      page_no: this.page,
      page_size: this.pagination.pageSize,
      startImpTime: this.startImpTime,
      endImpTime: this.endImpTime,
      startCollectTime: this.startCollectTime,
      endCollectTime: this.endCollectTime,
      bts: this.bts
    })
    if (res.status === 0) {
      this.tableData = res.data.data
      this.total = res.data.total
    }
  }
  public export = async () => {
    await this.searchService.exportExcel({
      'wifiSearchVo': {
        'startImpTime': '2019-07-09',
        'endImpTime': '2019-07-11',
        'bts': '11133WIFI'
      },
    })
  }

  public search = () => {
    this.searchData()
    this.startImpTime = ''
    this.endImpTime = ''
    this.startCollectTime = ''
    this.endCollectTime = ''
    this.bts = ''
  }

  public onSelectChange: any = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  }
  
  public changePage = (page: number) => {
    this.page = page
    this.searchData()
  }

  constructor (props: any) {
    super(props)
    this.searchService = props.searchService

    this.pagination = {
      pageSize: 10,
      size: 'middle',
      onChange: this.changePage,
      hideOnSinglePage: true
    }
    this.searchData()
    console.log(this.searchData())
  }

  public render () {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div className="home-main">
        <div className="operate-bar">
          <Row>
            <Col span={5}>
              <span>采集时间</span>
              <RangePicker 
                size="small" 
                className="range" 
                placeholder={['开始时间', '结束时间']}
                
                />
            </Col>
            <Col span={5}>
              <span>入库时间</span>
              <RangePicker size="small" className="range" placeholder={['开始时间', '结束时间']} />
            </Col>
            <Col span={3}>
              <span>设备</span>
              <Input
               size="small"
               className="device-input" 
               placeholder="输入ID域名称" 
               value={this.bts}
               onChange={e => { this.bts = e.target.value }}
               />
            </Col>
            <Col span={2}>
            <Button size="small" className="export-btn" icon="search" onClick={this.search}>搜索</Button>
            </Col>
            <Col offset={6} span={3}>
              <Button className="export-btn" size="small" icon="search" onClick={this.export}>导出为Excel</Button>
            </Col>
          </Row>
        </div>
        <div className="search-wrapper">
            <Table size="small"
              rowSelection={rowSelection} 
              columns={this.columns} 
              dataSource={this.tableData} 
            />           
        </div>
      </div>
    )
  }
}