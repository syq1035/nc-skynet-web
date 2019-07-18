import { Service } from '..'
import { action } from 'mobx'

export class UserService extends Service {

  constructor (path: string = '/api/user') {
    super(path)
  }

  @action public async sign (data: any = {}): Promise<any> {
    return this.post('/login', data)
  }

  @action public async sigout (data: any = {}): Promise<any> {
    return this.post('/logout', data)
  }

  @action public async getProfile (data: any = {}): Promise<any> {
    return this.get('/profile', data)
  }

  @action public async getUseList (data: any = {}): Promise<any> {
    return this.get('/list', data)
  }
  
  @action public async changepwd (data: any = {}): Promise<any> {
    return this.put('/change_pwd', data)
  }
}

export default new UserService()