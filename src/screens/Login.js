import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {DASHBOARD} from '../utils/Routes'
import {sha3_256} from 'js-sha3'
import Error from '../components/Error'
import LoadingButton from '../components/LoadingButton'
import {get_keystore} from '../lib/Api'
import Validations from '../utils/Validations'
import session from '../lib/Session'

const $ = window.$

export default class Login extends Component {
  state = {
    rut: '',
    password: '',
    error: '',
    loading: false
  }

  componentDidMount() {
    if (session.valid()) {
      this.props.history.push(DASHBOARD)
    }
  }

  submit = (e) => {
    e.preventDefault()
    let rut = this.state.rut.trim()
    let password = this.state.password.trim()

    if (rut.length === 0 || password.length === 0) {
      return
    }

    this.setState({loading: true})
    let token = sha3_256(password)
    get_keystore(rut, token).then(keystore => {
      session.new_session(keystore, rut, token)
      this.props.history.push(DASHBOARD)
    }).catch(this.onError)
  }

  onError = (e) => {
    console.error(e)
    this.setState({error: e.message ? e.message : e, loading: false})
  }

  onChange = (e) => {
    let id = e.target.id
    let value = e.target.value
    let required = e.target.required
    let validation = e.target.dataset.validation

    if (validation) {
      if (!Validations[validation](value)) {
        $('#' + id).addClass('is-invalid')
        this.setState({valid: required ? false : true})
      } else {
        $('#' + id).removeClass('is-invalid')
        this.setState({valid: true})
      }
    }

    this.setState({[id]: value})
  }

  render() {
    let {rut, password} = this.state
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="text-center">
            <img src="img/logo.png" alt="logo"/>
            <h1 className="display-5">Receta medica electronica Dapp</h1>
          </div>
          <div className="card bg-light">
            <div className="card-body">
              <form onSubmit={this.submit}>
                <div className="form-group">
                  <label htmlFor="rut">Rut</label>
                  <input className="form-control" placeholder="Ingrese el rut" id="rut" value={rut} onChange={this.onChange} data-validation="rut" required/>
                  <div className="invalid-feedback">El rut no es valido.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input type="password" className="form-control" placeholder="Ingrese su contraseña" id="password" value={password} onChange={this.onChange} required/>
                  <div className="invalid-feedback">La contraseña es requerida.</div>
                </div>
                <Error message={this.state.error} onClick={() => this.setState({error: ''})}/>
                <LoadingButton loading={this.state.loading} label="Ingresar"/>
                <Link className="btn btn-link btn-block" to="/account">Registrarse</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
