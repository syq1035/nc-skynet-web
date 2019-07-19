import { DatePicker, Input, Row, Col, Table, Icon, message, Upload } from 'antd';
import { observable } from 'mobx'
import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { UserStore } from 'src/stores/modules/user'
import { ControlService } from 'src/services/control'
import { WarningService } from 'src/services/warning'
import { TaskService } from 'src/services/task'
import Add from './modals/add'
import ExportExcel from 'src/modals/export_excel'
import utils from 'src/utils/index'

const { RangePicker } = DatePicker;
interface WarningPorps extends RouteComponentProps {
  userStore: UserStore
}
@inject('warningService', 'controlService', 'taskService', 'userStore')
@observer
export default class Warning extends React.Component<WarningPorps, {}> {  

  public userStore: UserStore
  public warningService: WarningService
  public controlService: ControlService
  public taskService: TaskService
  public addRef: any
  public exportRef: any
  public account: any

  @observable public isControl: boolean = true
  @observable public exportModal: boolean = false
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
  @observable public uploadProps: any

  public bkColumns: any = [
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
      key: 'create_time',
      render: (text: any, record: any) => (
        <span>
          {utils.momentDate(record.create_time, 'date_time')}
        </span>
      ),
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
  ]

  public yjColumns: any = [
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
      title: '预警Mac',
      dataIndex: 'mac',
      key: 'mac'
    },
    {
      title: '预警状态',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: '预警时间',
      key: 'warn_time',
      render: (text: any, record: any) => (
        <span>
          {utils.momentDate(record.create_time, 'date_time')}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <span className="action">
          <a href="javascript:;" onClick={this.showDetail.bind(this, record.id)}>详情</a>
        </span>
      ),
    }
  ]

  public state: any = {
    selectedRowKeys: []
  }

  public getAccountt () {
    const account: any = this.userStore.getAccount()
    return account.access_token
  }

  public searchData = async () => {
    this.tableData = []
    if (this.isControl) {
      const res: any = await this.controlService.getList({
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
    } else {
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
  }

  public newTask = async () => {
    if (this.isControl) {
      const res: any = await this.controlService.newTask({
        'wifiSearchVo': {
          startImpTime: this.startTime,
          endImpTime: this.endTime,
          mac: this.mac,
          type: this.type,
        },
        'ids': this.state.selectedRowKeys
      })
      if (res.status === 0) {
        message.success('新建下载任务成功')
        this.exportRef.getTaskList()
      }
    } else {
      const res: any = await this.warningService.newTask({
        'wifiSearchVo': {
          warnStartTime: this.startTime,
          warnEndTime: this.endTime,
          mac: this.mac,
          type: this.type,
        },
        'ids': this.state.selectedRowKeys
      })
      if (res.status === 0) {
        message.success('新建下载任务成功')
        this.exportRef.getTaskList()
      }
    }
    
  }

  public delete = async (id: any) => {
    const res: any = await this.controlService.deleteC({
      ids: id
    })
    if (res.status === 0) {
      message.success('删除成功')
      this.searchData()
    }
  }

  public changeType = (type: string) => {
    if (type === 'bk') {
      this.isControl = true
    } else {
      this.isControl = false
    }
    this.searchData()
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
    this.addRef.getDetail(id)
    this.showAddModal()
  }

  public closeEdit = () => {
    this.isEdit = false
  }

  public onRef = (ref: React.Component) => {
    this.addRef = ref
  }

  public showExportModal = () => {
    this.newTask()
    this.exportModal = true
  }

  public closeExportModal = () => {
    this.exportModal = false
  }

  public onExportRef = (ref: React.Component) => {
    this.exportRef = ref
  }

  constructor (props: any) {
    super(props)
    this.warningService = props.warningService
    this.controlService = props.controlService
    this.taskService = props.taskService
    this.userStore = props.userStore
    this.pagination = {
      pageSize: 11,
      size: 'middle',
      onChange: this.changePage,
      hideOnSinglePage: true,
      showQuickJumper: true
    }
    this.searchData()
    this.account = this.getAccountt()
    this.uploadProps = {
      action: '/api/control/upload',
      headers: {
        authorization: `Bearer ${this.account}`,
      },
      name: 'file',
      data: {
        upload: 'file'
      },
      onChange(info: any) {
        if (info.file.status === 'done') {
          message.success('上传成功')
        } else if (info.file.status === 'error') {
          message.error('上传失败')
        }
      },
    }
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
          onRef={this.onExportRef}
          close={this.closeExportModal}/>
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
            <div className={this.isControl ? 'click-btn bar-btn' : 'bar-btn'} onClick={this.changeType.bind(this, 'bk')}>
              <span>布控</span>
            </div>
          </Col>
          <Col offset={1} span={2}>
            <div className={this.isControl ? 'bar-btn' : 'click-btn bar-btn'} onClick={this.changeType.bind(this, 'yj')}>
              <span>预警</span>
            </div>
          </Col>  
          </Row>
        </div>
        <div className="operate-bar">         
          <Row>
            <Col span={3}>
              <span>{this.isControl ? '布控类型' : '预警类型'}</span>
              <Input
               size="small"
               className="device-input" 
               placeholder="输入类型名称" 
               value={this.type}
               onChange={e => {this.type = e.target.value}}
               />
            </Col>
            <Col span={3}>
              <span>{this.isControl ? '布控Mac' : '预警Mac'}</span>
              <Input
               size="small"
               className="device-input" 
               placeholder="输入Mac" 
               value={this.mac}
               onChange={e => {this.mac = e.target.value}}
               />
            </Col>
            <Col span={5}>
              <span>{this.isControl ? '布控时间' : '预警时间'}</span>
              <RangePicker 
                size="small" 
                className="range" 
                placeholder={['开始时间', '结束时间']} 
                onChange={this.changeTime}
                />
            </Col>
            <Col span={2}>
              <div className="btn" onClick={this.searchData}>
                <Icon type="search"></Icon>
                <span>搜索</span>
              </div>
            </Col>
            {this.isControl ? 
              <Col offset={1} span={10}>
                <Col span={4}>
                  {this.isControl ? 
                    <div className="btn" onClick={this.showAddModal}>
                      <Icon type="plus"></Icon>
                      <span>添加布控</span>
                    </div> : ''
                  }
                </Col>          
                <Col offset={1}  span={4}>
                  {this.isControl ? 
                    <div className="btn" onClick={this.delete.bind(this, this.state.selectedRowKeys)}>
                      <Icon type="close"></Icon>
                      <span>删除选中</span>
                    </div> : ''
                  }
                </Col>
                <Col offset={1}  span={4}>
                  <div className="btn">
                  <Upload {...this.uploadProps}>
                    <Icon type="download"></Icon>
                    <span>导入Excel</span>
                  </Upload>
                  </div>
                </Col>
                <Col offset={1}  span={4}>
                  <div className="btn" onClick={this.showExportModal}>
                    <Icon type="upload"></Icon>
                    <span>导出</span>
                  </div>
                </Col>
                <Col offset={1}  span={4}>
                  <div className="btn">
                    <a href="/api/task/export">
                      <Icon type="download"></Icon>
                      <span>下载模板</span>
                    </a>
                  </div>
                </Col> 
              </Col> : 
              <Col offset={9} span={2}>
              <div className="btn" onClick={this.showExportModal}>
                <Icon type="upload"></Icon>
                <span>导出</span>
              </div>
            </Col>
            }
            
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
              columns={this.isControl ? this.bkColumns : this.yjColumns} 
              dataSource={this.tableData} 
            />           
        </div>
      </div>
    )
  }
}