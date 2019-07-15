import * as React from 'react'
import { inject, observer } from 'mobx-react';
import { UserStore } from 'src/stores/modules/user'
import { RouteComponentProps } from 'react-router';

@inject()
@observer
export default class ImportantArea extends React.Component<RouteComponentProps, {}> {  

  public userStore: UserStore

  constructor (props: any) {
    super(props)

  }

  public render () {
    return (
      <div className="home-main">
        重点区域
      </div>
    )
  }
}