import { Modal, Input, message } from 'antd'
import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user';
import { observable } from 'mobx';
import { UserService } from 'src/services/user'

export interface ModifyPasswordProps {
  visible: boolean
  close: () => void
}

interface DataProp {
  old_pwd: string
  new_pwd: string
  check_pwd: string
}

class ModalProps {
  public className: string = 'add-modal'
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

@inject('userService')
@observer
export default class Add extends React.Component<ModifyPasswordProps, {}> {

  @observable public data: DataProp
  @observable public title: string = '修改密码'
  public userStore: UserStore
  public userService: UserService
  public modalProps: any
  constructor (props: any) {
    super(props)
    this.userService = props.userService
    this.modalProps = new ModalProps(this.ok, this.cancel)
    this.refresh()
  }

  public refresh = () => {
    this.data = {
      old_pwd: '',
      new_pwd: '',
      check_pwd: ''
    }
  }

  public ok = async () => {

      if (!this.data.old_pwd) {
        message.error('原始不能为空')
        return
      }
      if (!this.data.new_pwd) {
        message.error('新密码不能为空')
        return
      }
      if (!this.data.check_pwd) {
        message.error('确认密码不能为空')
        return
      }
      if (this.data.new_pwd !== this.data.check_pwd) {
        message.error('确认密码与新密码不一致')
        return
      }
      
      const res: any = await this.userService.changepwd(this.data)
      if (res.status === 0) {
        message.success('修改成功')
        this.props.close()
      }  
  }

  public cancel = () => {
    this.refresh()
    this.props.close()
  }

  public componentWillReceiveProps (props: any) {
    this.modalProps.visible = props.visible
  }

  public render () {
    return (
      <Modal {...this.modalProps} title={this.title}>
        <div className="form-input">
          <label>原始密码</label>
          <Input
            type="password"
            placeholder="请填写原始密码（必填）"
            value={this.data.old_pwd}
            onChange={e => {this.data.old_pwd = e.target.value}}
          />
        </div>
        <div className="form-input">
          <label>新密码</label>
          <Input
            type="password"
            placeholder="请填写新密码（必填）"
            value={this.data.new_pwd}
            onChange={e => {this.data.new_pwd = e.target.value}}
          />
        </div>
        <div className="form-input">
          <label>确认密码</label>
          <Input
            type="password"
            placeholder="请填写确认密码（必填）"
            value={this.data.check_pwd}
            onChange={e => {this.data.check_pwd = e.target.value}}
          />
        </div>
      </Modal>
    )
  }
}