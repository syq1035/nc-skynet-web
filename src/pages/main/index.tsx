import { observer, inject } from 'mobx-react'
import * as React from 'react'
import { message, Icon, Dropdown, Menu } from 'antd'
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router'
import { NavLink } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { observable } from 'mobx'

import Home from './home'
import Search from './search'
import ImportantArea from './important_area'
import Warning from './warning'
import Tasklist from './tasklist'
import ModifyPassword from './modals/modify_password'

import { UserService } from 'src/services/user'
import { UserStore } from 'src/stores/modules/user'

@inject('userService', 'userStore')
@observer
class Main extends React.Component<RouteComponentProps<{}>, {}> {

  public userService: UserService
  public userStore: UserStore

  @observable public menuList: any[] = []
  @observable public selectItem: string[]
  @observable public selectExpand: string[] = []
  @observable public name: string
  @observable public modifyPasswordModal: boolean = false

  constructor (props: any) {
    super(props)
    this.initConfig(props)
    this.getProfile()
  }

  public initConfig (props: any): void {
    this.userService = props.userService
    this.userStore = props.userStore
  }

  public closeModifyPasswordModal = () => {
    this.modifyPasswordModal = false
    
  }

  public showModifyPasswordModal = () => {
    this.modifyPasswordModal = true
  }

  public async getProfile () {
    const res = await this.userService.getProfile()
    if (res.status === 0) {
      this.name = res.data.name
    } else {
      message.error(res.msg || '操作失败')
    }
  }

  public sigout = async (): Promise<any> => {
    const res = await this.userService.sigout()
    if (res.status === 0) {
      this.userStore.sigout()
    } else {
      message.error(res.msg || '操作失败')
    }
  }

  public render () {
    const location = this.props.location
    const { pathname } = location
    const menu = (
      <Menu>
        <Menu.Item>
          <span onClick={this.showModifyPasswordModal}>
            修改密码
          </span>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="main">
        <div className="header">
          <div className="title"></div>
          <div className="menu">
            <NavLink exact activeClassName="active" to="/main/home">首页</NavLink>
            <NavLink exact to="/main/search">数据查询</NavLink>
            <NavLink exact to="/main/importantarea">重点区域</NavLink>
            <NavLink exact to="/main/warning">布控预警</NavLink>
            <NavLink exact to="/main/tasklist">任务列表</NavLink>
          </div>
          <div className="user">
            <Dropdown overlay={menu}
              placement="bottomCenter">
              <div className="admin">
                <div className="avatar">
                    <Icon type="user" />  
                </div>
              </div>
            </Dropdown>
            <div className="user-name">{this.name}</div>
            <div className="logout" onClick={this.sigout}>
              <Icon type="logout" />
            </div>
          </div>
        </div>
        <div className="main-body">
          <TransitionGroup className="main-route">
            <CSSTransition
              key={pathname.split('/')[2]}
              timeout={{ enter: 1000, exit: 0 }}
              classNames={'fade'}>
                <Switch location={location}>
                  <Route
                    path="/main/home"
                    component={Home}
                  />
                  <Route
                    path="/main/search"
                    component={Search}
                  />
                  <Route
                    path="/main/importantarea"
                    component={ImportantArea}
                  />
                  <Route
                    path="/main/warning"
                    component={Warning}
                  />
                  <Route
                    path="/main/tasklist"
                    component={Tasklist}
                  />
                  <Redirect to="/main/warning" />
                </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
        <ModifyPassword visible={this.modifyPasswordModal} close={this.closeModifyPasswordModal}/>
      </div>
    )
  }
}

export default Main