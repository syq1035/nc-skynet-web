import { Service } from '..'
import { action } from 'mobx'

export class HomeService extends Service {

  constructor (path: string = '/api') {
    super(path)
  }

  @action public async traffic (data: any = {}): Promise<any> {
    return this.get('/index/traffic', data)
  }

  @action public async deviceCount (data: any = {}): Promise<any> {
    return this.get('/index/device_count', data)
  }

  @action public async cityCount (data: any = {}): Promise<any> {
    return this.get('/index/city_count', data)
  }

  @action public async areaCount (data: any = {}): Promise<any> {
    return this.get('/index/qs_by', data)
  }

  @action public async statCards (data: any = {}): Promise<any> {
    return this.get('/index/stat_cards', data)
  }
}

export default new HomeService()