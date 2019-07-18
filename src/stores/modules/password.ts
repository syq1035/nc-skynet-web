import { action, observable } from 'mobx'

export class PasswordStore {
  @observable private modalVisible: boolean

  constructor () {
    this.modalVisible = false
  }

  public get getModalVisible () {
    return this.modalVisible
  }

  @action public showModal () {
    this.modalVisible = true
  }
  @action public closeModal () {
    this.modalVisible = false
  }
}

export default new PasswordStore()