import { Service } from '..'
import { action } from 'mobx'

export class WarningService extends Service {

  constructor (path: string = '/api/warn') {
    super(path)
  }

  @action public async getList (data: any = {}): Promise<any> {
    return this.get('/list', data)
  }
  @action public async getDetail (data: any = {}): Promise<any> {
    return this.get('/detail', data)
  }

  @action public async newTask (data: any = {}): Promise<any> {
    return this.post('/new_task', data)
  }
}

export default new WarningService()