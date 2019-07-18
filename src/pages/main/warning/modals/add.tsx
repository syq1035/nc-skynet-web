import { Modal, Input, message } from 'antd'
import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user';
import { observable } from 'mobx';
import { WarningService } from 'src/services/warning'

export interface Addprops {
  visible: boolean
  isEdit: boolean
  isDetail: boolean
  onRef: (ref: React.Component) => void
  close: () => void
  refresh: () => void
}

interface DataProp {
  id: number
  police_name: string
  police_id: string
  controller_name: string
  mac: string
}

class ModalProps {
  public centered: boolean = true
  public cancelText: string = '取消'
  public okText: string = '确定'
  public visible: boolean = false
  public onOk: any
  public onCancel: any

  constructor (onOk: any, onCancel: any) {
    this.onOk = onOk
    this.onCancel = onCancel
  }
}

@inject('warningService')
@observer
export default class Add extends React.Component<Addprops, {}> {

  @observable public data: DataProp
  @observable public title: string = '添加布控'
  public userStore: UserStore
  public warningService: WarningService
  public modalProps: any
  constructor (props: any) {
    super(props)
    this.warningService = props.warningService
    this.modalProps = new ModalProps(this.ok, this.cancel)
    this.refresh()
  }

  public refresh = () => {
    this.data = {
      id: 0,
      police_name: '',
      police_id: '',
      controller_name: '',
      mac: ''
    }
  }

  public getDetail = async (id: number) => {
    const res: any = await this.warningService.getDetail({
      id
    })
    if (res.status === 0) {
      this.data = {
        id,
        police_name: res.data.police_name,
        police_id: res.data.police_id,
        controller_name: res.data.controller_name,
        mac: res.data.mac
      }
      if (this.props.isDetail) {
        this.title = '布控详情'
      }
      if (this.props.isEdit) {
        this.title = '编辑布控'
      }
      
    }
  }

  public ok = async () => {
    if (!this.data.police_name) {
      message.error('责任民警不能为空')
      return
    }
    if (!this.data.police_id) {
      message.error('警号不能为空')
      return
    }
    if (!this.data.controller_name) {
      message.error('管控人不能为空')
      return
    }
    if (!this.data.mac) {
      message.error('布控Mac不能为空')
      return
    }
    if (this.data.id) {
      console.log(this.data)
      const res: any = await this.warningService.edit(this.data)
      if (res.status === 0) {
        message.success('编辑成功')
        this.refresh()
        this.props.refresh()
        this.props.close()
      }
    } else {
      const res: any = await this.warningService.add(this.data)
      if (res.status === 0) {
        message.success('添加成功')
        this.refresh()
        this.props.refresh()
        this.props.close()
      }
    }   
  }

  public cancel = () => {
    this.refresh()
    this.props.close()
  }

  public componentDidMount () {
    this.props.onRef(this)
  }
  public componentWillReceiveProps (props: any) {
    this.modalProps.visible = props.visible
  }

  public render () {
    const { isDetail } = this.props
    return (
      <Modal {...this.modalProps} title={this.title} className={isDetail ? 'detail-modal add-modal' : 'add-modal'} >
        <div className="form-input">
          <label>责任民警</label>
          <Input
            placeholder="请填写责任民警（必填）"
            disabled={isDetail}
            value={this.data.police_name}
            onChange={e => {this.data.police_name = e.target.value}}
          />
        </div>
        <div className="form-input">
          <label>警号</label>
          <Input
            placeholder="请填写警号（必填）"
            disabled={isDetail}
            value={this.data.police_id}
            onChange={e => {this.data.police_id = e.target.value}}
          />
        </div>
        <div className="form-input">
          <label>管控人</label>
          <Input
            placeholder="请填写管控人（必填）"
            disabled={isDetail}
            value={this.data.controller_name}
            onChange={e => {this.data.controller_name = e.target.value}}
          />
        </div>
        <div className="form-input">
          <label>布控Mac</label>
          <Input
            placeholder="请填写布控Mac（必填）"
            disabled={isDetail}
            value={this.data.mac}
            onChange={e => {this.data.mac = e.target.value}}
          />
        </div>
      </Modal>
    )
  }
}