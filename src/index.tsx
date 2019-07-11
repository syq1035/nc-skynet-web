import { Provider } from 'mobx-react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './pages/App'
import registerServiceWorker from './pwa/registerServiceWorker'
import AppRouter from './routers'
import stores from './stores'
import services from './services'
import echarts from 'echarts'

import 'antd/dist/antd.less'
import './styles/stylus/index.styl'
import './styles/less/my-theme.less'

ReactDOM.render(
  <Provider {...stores} {...services} echarts={echarts}>
    <App>
      <AppRouter />
    </App>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
