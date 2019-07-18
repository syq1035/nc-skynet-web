import { Service } from '..'
import { action } from 'mobx'

export class WarningService extends Service {

  constructor (path: string = '/api/control') {
    super(path)
  }

  @action public async getList (data: any = {}): Promise<any> {
    return this.get('/list', data)
  }

  @action public async add (data: any = {}): Promise<any> {
    return this.post('/insert', data)
  }

  @action public async edit (data: any = {}): Promise<any> {
    return this.put('/update', data)
  }

  @action public async deleteC (data: any = {}): Promise<any> {
    return this.post('/del', data)
  }

  @action public async getDetail (data: any = {}): Promise<any> {
    return this.get('/detail', data)
  }

  @action public async newTask (data: any = {}): Promise<any> {
    return this.post('/new_task', data)
  }

  @action public async upload (data: any = {}): Promise<any> {
    return this.post('/upload', data)
  }
}

export default new WarningService()