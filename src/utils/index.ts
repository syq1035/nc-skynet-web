import moment from 'moment'

export default class Util {
  public hasOwnProperty: any
  public propIsEnumerable: any

  constructor () {
    this.hasOwnProperty = Object.prototype.hasOwnProperty
    this.propIsEnumerable = Object.prototype.propertyIsEnumerable
  }

  public isObj (x: any) { 
    const type = typeof x
    return x !== null && (type === 'object' || type === 'function')
  }
  
  public toObject (val: any) {
    if (val === null || val === undefined) {
      throw new TypeError('Cannot convert undefined or null to object')
    }
    return Object(val)
  }
  
  public assignKey (to: any, from: any, key: any) {
    const val = from[key]
  
    if (val === undefined || val === null) {
      return
    }
    if (this.hasOwnProperty.call(to, key)) {
      if (to[key] === undefined || to[key] === null) {
        throw new TypeError('Cannot convert undefined or null to object (' + key + ')')
      }
    }
    if (!this.hasOwnProperty.call(to, key) || !this.isObj(val)) {
      to[key] = val
    } else {
      to[key] = this.assign(Object(to[key]), from[key])
    }
  }
  
  public assign (to: any, from: any) {
    if (to === from) {
      return to
    }
    from = Object(from)
    for (const key in from) {
      if (this.hasOwnProperty.call(from, key)) {
        this.assignKey(to, from, key)
      }
    }
    if (Object.getOwnPropertySymbols) {
      const symbols = Object.getOwnPropertySymbols(from)

      symbols.forEach(item => {
        if (this.propIsEnumerable.call(from, item)) {
          this.assignKey(to, from, item)
        }
      })
    }
    return to
  }
  
  public deepAssign (target: any, from: any) {
    target = this.toObject(target)
    for (const index in from) {
      if (from.hasOwnProperty(index)) {
        this.assign(target, from[index])
      }
    }
    return target
  };

  public static momentDate (num: any, type: string = 'date_time'): string {
    if (num) {
      if (Object.prototype.toString.call(num) === '[object Date]') {
        num = num.getTime()
      }
      switch (type) {
        case 'date':
          return moment(parseInt(num, 10)).format('YYYY-MM-DD')
        case 'date_h':
          return moment(parseInt(num, 10)).format('YYYY/MM/DD')
        case 'date_time':
          return moment(parseInt(num, 10)).format('YYYY-MM-DD HH:mm:ss')
        case 'data_h_time':
          return moment(parseInt(num, 10)).format('YYYY/MM/DD HH:mm:ss')
        case 'data_h_time_h':
          return moment(parseInt(num, 10)).format('YYYY/MM/DD HH:mm')
        case 'time':
          return moment(parseInt(num, 10)).format('HH:mm:ss')
        case 'time_h':
          return moment(parseInt(num, 10)).format('HH:mm')
        default:
          return moment(parseInt(num, 10)).format('YYYY-MM-DD HH:mm:ss')
      }
    } else {
      return ''
    }
  }

}
