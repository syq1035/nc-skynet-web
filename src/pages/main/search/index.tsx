import { DatePicker, Input, Row, Col, Table, message, Icon } from 'antd';
import { observable } from 'mobx'
import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
import { RouteComponentProps } from 'react-router';
import { SearchService } from 'src/services/search'
import ExportExcel from 'src/modals/export_excel'

const { RangePicker } = DatePicker;
@inject('searchService')
@observer
export default class Home extends React.Component<RouteComponentProps, {}> {
  public userStore: UserStore
  public searchService: SearchService
  public tableConfig: any[]
  public exportRef: any
  
  @observable public exportModal: boolean = false
  @observable public tableData: any[]
  @observable public page: number = 1
  @observable public total: number
  @observable public pagination: any
  @observable public startImpTime: any = ''
  @observable public endImpTime: any = ''
  @observable public startCollectTime: any = ''
  @observable public endCollectTime: any = ''
  @observable public bts: string = ''

  public state: any = {
    selectedRowKeys: []
  }

  constructor (props: any) {
    super(props)
    this.searchService = props.searchService

    this.pagination = {
      pageSize: 12,
      size: 'middle',
      onChange: this.changePage,
      hideOnSinglePage: true,
      showQuickJumper: true
    }
    this.initTable()
  }

  public initTable = () => {
    const first: number = (this.page - 1) * this.pagination.pageSize + 1
    const last: number = this.page * this.pagination.pageSize
    this.tableConfig = [
      {
        title: `${first}/${last}项`,
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '事件ID',
        dataIndex: 'adivision',
        key: 'adivision',
      },
      {
        title: '设备ID',
        dataIndex: 'bts_id',
        key: 'bts_id',
      },
      {
        title: '设备名称',
        dataIndex: 'bts_name',
        key: 'bts_name',
      },
      {
        title: '前台序列号',
        dataIndex: 'sn',
        key: 'sn',
      },
      {
        title: 'MAC',
        dataIndex: 'mac',
        key: 'mac',
      },
      {
        title: '坐标',
        key: 'lat',
        render: (text: any, record: any) => (
          <span>
            {record.lng},{record.lat}
          </span>
        ),
      },
      {
        title: '采集时间',
        dataIndex: 'collect_time',
        key: 'collect_time',
      },
      {
        title: '入库时间',
        dataIndex: 'imp_time',
        key: 'imp_time',
      }
    ]
    this.searchData()
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
      this.tableData = res.data.list
      this.total = res.data.total
    }
  }

  public newTask = async () => {
    const res: any = await this.searchService.newTask({
        startCollectTime: this.startCollectTime,
        endCollectTime: this.endCollectTime,
        startImpTime: this.startImpTime,
        endImpTime: this.endImpTime,
        bts: this.bts,
        ids: this.state.selectedRowKeys
    })
    if (res.status === 0) {
      message.success('新建任务成功')
      this.exportRef.getTaskList()
    }
  }

  public onSelectChange = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  }
  
  public changePage = (page: number) => {
    this.page = page
    this.initTable()
  }

  public changeCellectTime = (date: any, dateString: any) => {
    this.startCollectTime = dateString[0]
    this.endCollectTime = dateString[1]
  }

  public changeImpTime = (date: any, dateString: any) => {
    this.startImpTime = dateString[0]
    this.endImpTime = dateString[1]
  }

  public showExportModal = () => {
    this.newTask()
    this.exportModal = true
  }

  public closeExportModal = () => {
    this.exportModal = false
  }

  public onRef = (ref: React.Component) => {
    this.exportRef = ref
  }

  public render () {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div className="search-main">
        <ExportExcel
          visible={this.exportModal}
          onRef={this.onRef}
          close={this.closeExportModal}/>
        <div className="operate-bar">
          <Row>
            <Col span={5}>
              <span>采集时间</span>
              <RangePicker 
                size="small" 
                className="range" 
                placeholder={['开始时间', '结束时间']}
                onChange={this.changeCellectTime}
                />
            </Col>
            <Col span={5}>
              <span>入库时间</span>
              <RangePicker 
                size="small" 
                className="range" 
                placeholder={['开始时间', '结束时间']} 
                onChange={this.changeImpTime}
                />
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
              <div className="btn" onClick={this.searchData}>
                <Icon type="search"></Icon>
                <span>搜索</span>
              </div>
            </Col>
            <Col offset={6} span={3}>
            <div className="btn" onClick={this.showExportModal}>
                <Icon type="search"></Icon>
                <span>导出Excel</span>
              </div>
            </Col>
          </Row>
        </div>
        <div className="search-wrapper">
            <Table size="small"
              rowKey="id"
              pagination={{
                ...this.pagination,
                current: this.page,
                total: this.total
              }}
              rowSelection={rowSelection} 
              columns={this.tableConfig} 
              dataSource={this.tableData} 
            />           
        </div>
      </div>
    )
  }
}