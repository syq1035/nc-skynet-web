import { Modal, Input, Form } from 'antd'
import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { UserService } from 'src/services/user'
import { FormComponentProps } from 'antd/lib/form'

export interface ModifyPasswordProps extends FormComponentProps {
  form: any
  visible: boolean
  close: () => void
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
class ModifyPassword extends React.Component<ModifyPasswordProps, {}> {

  @observable public title: string = '修改密码'
  public userService: UserService
  public modalProps: any

  constructor (props: any) {
    super(props)
    this.userService = props.userService
    this.modalProps = new ModalProps(this.ok, this.cancel)
    this.refresh()
  }

  public refresh = () => {
    this.props.form.resetFields()
  }

  public ok = async (e: any) => {
      e.preventDefault();
      this.props.form.validateFields((err: any, values: any) => {
        if (!err) {
          this.changepwd(values)
        } 
      });
      
  }
  public async changepwd (values: any) {
    const params = {
      ...values
    }
    const res: any = await this.userService.changepwd(params)
    if (res.status === 0) {
      this.props.close()
    }  
  }
  public cancel = () => {
    this.refresh()
    this.props.close()
  }
  public compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('new_pwd')) {
      callback('确认密码与新密码不一致!');
    } else {
      callback();
    }
  }
  public componentWillReceiveProps (props: any) {
    this.modalProps.visible = props.visible
  }
  public render () {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const { getFieldDecorator } = this.props.form
    return (
      <Modal {...this.modalProps} title={this.title}>
        <Form {...formItemLayout}>
          <Form.Item label="原始密码" hasFeedback>
            {getFieldDecorator('old_pwd', {
              rules: [
                {
                  required: true,
                  message: '原始密码不能为空!',
                }
              ]
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="新密码" hasFeedback>
            {getFieldDecorator('new_pwd', {
              rules: [
                {
                  required: true,
                  message: '新密码不能为空!',
                }
              ]
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="确认密码" hasFeedback>
          {getFieldDecorator('check_pwd', {
            rules: [
              {
                required: true,
                message: '确认密码不能为空!',
              },
              {
                validator: this.compareToFirstPassword,
              }
            ]
          })(<Input.Password/>)}
        </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<ModifyPasswordProps>()(ModifyPassword)