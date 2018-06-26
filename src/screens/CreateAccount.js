import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {DASHBOARD, LOGIN} from '../utils/Routes'
import {sha3_256} from 'js-sha3'
import Error from '../components/Error'
import LoadingButton from '../components/LoadingButton'
import {create_keys} from '../lib/Lightwallet'
import {save_keystore} from  '../lib/Api'
import Validations from '../utils/Validations'
import session from '../lib/Session'

const $ = window.$

export default class CreateAccount extends Component {
  state = {
    rut: '',
    password: '',
    repassword: '',
    error: '',
    loading: false,
    showSeeWords: false
  }

  submit = (e) => {
    e.preventDefault()
    let rut = this.state.rut.trim()
    let password = this.state.password.trim()
    let repassword = this.state.repassword.trim()

    if (rut.length === 0 || password.length === 0) {
      return
    }
    if (password !== repassword) {
      return
    }

    this.setState({error: '', loading: true})
    create_keys(password).then(keys => {
      let keystore = keys.keystore.serialize()
      let data = {
        token: sha3_256(password),
        keystore
      }
      this.setState({showSeeWords: true})
      save_keystore(rut, data).then(() => {
        session.new_session(keystore, rut, data.token)
        this.props.history.push(DASHBOARD)
      }).catch(this.onError)
    })
  }

  onError = (e) => {
    this.setState({error: e.message ? e.message : e, loading: false})
  }

  onChange = (e) => {
    let id = e.target.id
    let value = e.target.value
    let required = e.target.required
    let validation = e.target.dataset.validation
    let equals = e.target.dataset.equals

    if (validation) {
      if (!Validations[validation](value)) {
        $('#' + id).addClass('is-invalid')
        this.setState({valid: required ? false : true})
      } else {
        $('#' + id).removeClass('is-invalid')
        this.setState({valid: true})
      }
    }
    if (equals) {
      if (value !== this.state[equals]) {
        $('#' + id).addClass('is-invalid')
      } else {
        $('#' + id).removeClass('is-invalid')
      }
    }

    this.setState({[id]: value})
  }

  render() {
    let {rut, password, repassword} = this.state
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="text-center">
            <img src="img/logo.png" alt="logo"/>
            <h1 className="display-5">Nuevo Usuario</h1>
          </div>
          <div className="card bg-light">
            <div className="card-body">
              <form onSubmit={this.submit}>
                <div className="form-group">
                  <label htmlFor="rut">Rut</label>
                  <input className="form-control" id="rut" placeholder="Ingrese el rut" value={rut} onChange={this.onChange} data-validation="rut" required/>
                  <div className="invalid-feedback">Ingrese un rut valido.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input type="password" className="form-control" id="password" placeholder="Ingrese su contraseña" value={password} onChange={this.onChange} required/>
                  <div className="invalid-feedback">La contraseña es requerida.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="repassword">Reingrese Contraseña</label>
                  <input type="password" className="form-control" id="repassword" placeholder="Ingrese nuevamente su contraseña"
                    value={repassword} onChange={this.onChange} data-equals="password" required/>
                  <div className="invalid-feedback">Las contraseñas deben ser iguales.</div>
                </div>
                <Error message={this.state.error} onClick={() => this.setState({error: ''})}/>
                <LoadingButton loading={this.state.loading} label="Crear Cuenta"/>
                <Link className="btn btn-link btn-block" to={LOGIN}>Volver</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
