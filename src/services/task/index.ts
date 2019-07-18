import { Service } from '..'
import { action } from 'mobx'

export class TaskService extends Service {

  constructor (path: string = '/api/task') {
    super(path)
  }

  @action public async getTaskList (data: any = {}): Promise<any> {
    return this.get('/task_list', data)
  }
  @action public async exportExcel (data: any = {}): Promise<any> {
    return this.get('/export', data)
  }
  @action public async exportTemplate (data: any = {}): Promise<any> {
    return this.get('/export', data)
  }
}

export default new TaskService()