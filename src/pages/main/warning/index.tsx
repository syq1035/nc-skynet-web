import { DatePicker, Input, Row, Col, Table, Icon, message } from 'antd';
import { observable } from 'mobx'
import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
import { WarningService } from 'src/services/warning'
import Add from './modals/add'

const { RangePicker } = DatePicker;
@inject('warningService')
@observer
export default class Warning extends React.Component<{}, {}> {  

  public userStore: UserStore
  public warningService: WarningService
  public addRef: any

  @observable public addModal: boolean = false
  @observable public isDetail: boolean = false
  @observable public isEdit: boolean = false
  @observable public itemId: number = 0
  @observable public tableData: any[]
  @observable public page: number = 1
  @observable public total: number
  @observable public pagination: any
  @observable public type: string = ''
  @observable public mac: string = ''
  @observable public startTime: string = ''
  @observable public endTime: string = ''

  public columns: any = [
    {
      title: '1/107项',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '责任民警',
      dataIndex: 'police_name',
      key: 'police_name'
    },
    {
      title: '警号',
      dataIndex: 'police_id',
      key: 'police_id'
    },
    {
      title: '管控人(姓名/身份证)',
      key: 'controller',
      render: (text: any, record: any) => (
        <span>
          {record.controller_name}/{record.controller_id}
        </span>
      ),
    },
    {
      title: '布控Mac',
      dataIndex: 'mac',
      key: 'mac'
    },
    {
      title: '布控状态',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: '坐标',
      dataIndex: 'zb',
      key: 'zb'
    },
    {
      title: '布控时间',
      dataIndex: 'create_time',
      key: 'create_time'
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks'
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <span className="action">
          <a href="javascript:;" onClick={this.showDetail.bind(this, record.id)}>详情</a>
          <a href="javascript:;" onClick={this.showEdit.bind(this, record.id)} >
            <Icon type="edit"/>编辑
          </a>
          <a href="javascript:;" onClick={this.delete.bind(this, [record.id])}>
            <Icon type="delete"/>删除
          </a>
        </span>
      ),
    }
  ];

  public state: any = {
    selectedRowKeys: []
  }

  public searchData = async () => {
    this.tableData = []
    const res: any = await this.warningService.getList({
      page_no: this.page,
      page_size: this.pagination.pageSize,
      type: this.type,
      mac: this.mac,
      startTime: this.startTime,
      endTime: this.endTime,
    })
    if (res.status === 0) {
      this.tableData = res.data.list
      this.total = res.data.total
    }
  }

  public getDetail = async (id: number) => {
    const res: any = await this.warningService.getDetail({
      id
    })
    if (res.status === 0) {
      console.log(res.data)
    }
  }

  public delete = async (id: any) => {
    console.log(id)
    console.log(JSON.stringify(id))
    const res: any = await this.warningService.deleteC({
      ids: JSON.stringify(id)
    })
    if (res.status === 0) {
      message.success('删除成功')
    }
  }

  public search = () => {
    this.searchData()
    this.type = ''
    this.mac = ''
    this.startTime = ''
    this.endTime = ''
  }

  public onSelectChange: any = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  }
  
  public changePage = (page: number) => {
    this.page = page
    this.searchData()
  }

  public changeTime = (date: any, dateString: any) => {
    this.startTime = dateString[0]
    this.endTime = dateString[1]
  }

  public showAddModal = () => {
    this.addModal = true
  }

  public closeAddModal = () => {
    this.addModal = false
    this.closeDetail()
    this.closeEdit()
  }

  public showDetail = (id: any) => {
    this.isDetail = true
    this.addRef.getDetail(id)
    this.showAddModal()
  }

  public closeDetail = () => {
    this.isDetail = false
  }

  public showEdit = (id: any) => {
    this.isEdit = true
    this.addRef.getEdit(id)
    this.showAddModal()
  }

  public closeEdit = () => {
    this.isEdit = false
  }

  public onRef = (ref: React.Component) => {
    this.addRef = ref
  }

  constructor (props: any) {
    super(props)
    this.warningService = props.warningService
    this.pagination = {
      pageSize: 11,
      size: 'middle',
      onChange: this.changePage,
      hideOnSinglePage: true,
      showQuickJumper: true
    }
    this.searchData()
  }

  public render () {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div className="search-main">
        <Add 
          visible={this.addModal}
          isDetail={this.isDetail}
          isEdit={this.isEdit}
          onRef={this.onRef}
          refresh={this.searchData} 
          close={this.closeAddModal}/>
        <div className="operate-bar">
          <Row>
          <Col span={2}>
            <div className="btn">
              <span>布控</span>
            </div>
          </Col>
          <Col offset={1} span={2}>
            <div className="btn">
              <span>预警</span>
            </div>
          </Col>  
          </Row>
        </div>
        <div className="operate-bar">         
          <Row>
            <Col span={3}>
              <span>布控类型</span>
              <Input
               size="small"
               className="device-input" 
               placeholder="输入类型名称" 
               value={this.type}
               onChange={e => {this.type = e.target.value}}
               />
            </Col>
            <Col span={3}>
              <span>布控Mac</span>
              <Input
               size="small"
               className="device-input" 
               placeholder="输入布控Mac" 
               value={this.mac}
               onChange={e => {this.mac = e.target.value}}
               />
            </Col>
            <Col span={5}>
              <span>布控时间</span>
              <RangePicker 
                size="small" 
                className="range" 
                placeholder={['开始时间', '结束时间']} 
                onChange={this.changeTime}
                />
            </Col>
            <Col span={2}>
              <div className="btn" onClick={this.search}>
                <Icon type="search"></Icon>
                <span>搜索</span>
              </div>
            </Col>
            <Col offset={1} span={2}>
              <div className="btn" onClick={this.showAddModal}>
                <Icon type="plus"></Icon>
                <span>添加布控</span>
              </div>
            </Col>
            <Col span={2}>
              <div className="btn" onClick={this.delete.bind(this, this.state.selectedRowKeys)}>
                <Icon type="close"></Icon>
                <span>删除选中</span>
              </div>
            </Col>
            <Col span={2}>
              <div className="btn">
                <Icon type="download"></Icon>
                <span>导入Excel</span>
              </div>
            </Col>
            <Col span={2}>
              <div className="btn">
                <Icon type="upload"></Icon>
                <span>导出</span>
              </div>
            </Col>
            <Col span={2}>
              <div className="btn">
                <Icon type="download"></Icon>
                <span>下载模板</span>
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
              columns={this.columns} 
              dataSource={this.tableData} 
            />           
        </div>
      </div>
    )
  }
}