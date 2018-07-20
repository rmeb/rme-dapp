import {initWeb3} from '../lib/Eth'

const storage = window.localStorage
const KEY = 'rme-dapp-session'

/**
* Maneja el localStorage para almacenar la sesion del usuario
**/
class Session {
  constructor() {
    this.data = null
    if (storage) {
      this.data = JSON.parse(storage.getItem(KEY))
    } else {
      console.error('no existe local storage.')
    }
  }

  init() {
    return initWeb3(this.data)
  }

  new_session(keystore, rut, token) {
    this.data = {rut, keystore, token}
    storage.setItem(KEY, JSON.stringify(this.data))
    return initWeb3(this.data)
  }

  logout() {
    storage.removeItem(KEY)
    this.data = null
  }

  valid() {
    return this.data !== null
  }

  get_data() {
    return this.data
  }
}

export default new Session()
