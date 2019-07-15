import concat from '../assets/json/concat'
import util from './index'

const utils = new util()

const Options = {
  getOptions: (type: string) => {
    switch (type) {
      case 'bar':
        return Object.assign({}, concat.barOptions)
      case 'line':
        return Object.assign({}, concat.lineOptions)
      case 'pie':
        return Object.assign({}, concat.pieOptions)
      case 'map':
        return Object.assign({}, concat.mapOptions)
      default:
        return Object.assign({}, concat.barOptions)
    }
  },
  setOptions: (options: any, data: any) => {
    for (const k in options) {
      if (k === 'series') {
        const tmp: any = []
        options[k].forEach((item: any, i: any) => {
          tmp.splice(i, 1, utils.deepAssign(data.series[i] || {}, item))
        })
        data.series = [].concat(tmp)
      } else {
        switch (Object.prototype.toString.call(options[k])) {
          case '[object Object]':
            data[k] = utils.deepAssign(data[k] || {}, options[k])
            break
          default:
            data[k] = options[k]
            break
        }
      }
    }
  }
}

export default Options
