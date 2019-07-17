import { Service } from '..'
import { action } from 'mobx'

export class SearchService extends Service {

  constructor (path: string = '/api/query') {
    super(path)
  }

  @action public async exportExcel (data: any = {}): Promise<any> {
    return this.post('/export', data)
  }

  @action public async getList (data: any = {}): Promise<any> {
    return this.get('/list', data)
  }
  
}

export default new SearchService()