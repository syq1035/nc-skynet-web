import { Table, Icon } from 'antd'
import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user';
import { observable } from 'mobx';
import { TaskService } from 'src/services/task'
import { RouteComponentProps } from 'react-router';

@inject('taskService')
@observer
export default class Add extends React.Component<RouteComponentProps, {}> {
  
  @observable public taskList: any
  @observable public page: number = 1
  @observable public total: number
  @observable public pagination: any
  public userStore: UserStore
  public taskService: TaskService
  public interval: any
  public columns: any = [
    {
      title: '文件名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '文件大小',
      key: 'size',
      render: (text: any, record: any) => (
        <span>{record.status ? record.size + 'KB' : ''}</span>
      )
    },
    {
      title: '导出状态',
      key: 'status',
      render: (text: any, record: any) => (
        <span>{ this.handleStatus(record.status, record.pecent)}</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <span>
          {record.status === 1 ?
            <a href={'/api/task/export?fileName=' + record.name}>
              <Icon type="cloud-download" />
            </a> : ''
          }
        </span>
      ),  
    },
  ]
  constructor (props: any) {
    super(props)
    this.taskService = props.taskService
    this.pagination = {
      pageSize: 15,
      size: 'middle',
      hideOnSinglePage: true,
      onChange: this.changePage,
    }
    this.getTaskList()
  }
  
  public changePage = (page: number) => {
    this.page = page
    this.getTaskList()
  }

  public getTaskList = async () => {
    const res: any = await this.taskService.getTaskList({
      page_no: this.page,
      page_size: this.pagination.pageSize
    })
    if (res.status === 0) {
      this.taskList = res.data.list
      this.total = res.data.total
    }
  }

  public handleStatus (status: number, pecent: number): any {
    if (status === 1) {
      return '已导出'
    }
    if (status === -1) {
      return '导出失败'
    }
    if (status === 0) {
      return pecent + '%'
    }
  }

  public componentDidMount() {
    this.interval = setInterval(this.getTaskList, 5000);
  }

  public componentWillUnmount () {
    clearInterval(this.interval);
  }

  public render () {
    return (
        <Table 
          className="tasklist"
          size="small"
          columns={this.columns} 
          dataSource={this.taskList}
          rowKey="id"
          pagination={{
            ...this.pagination,
            current: this.page,
            total: this.total
          }} 
        />
    )
  }

}