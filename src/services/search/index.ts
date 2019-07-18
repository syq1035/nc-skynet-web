import { Service } from '..'
import { action } from 'mobx'

export class SearchService extends Service {

  constructor (path: string = '/api/query') {
    super(path)
  }

  @action public async newTask (data: any = {}): Promise<any> {
    return this.post('/new_task', data)
  }
  
  @action public async getList (data: any = {}): Promise<any> {
    return this.get('/list', data)
  }
}

export default new SearchService()