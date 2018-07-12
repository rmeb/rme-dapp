import React, { Component } from 'react';
import Validations from '../utils/Validations'
import {sha3_256} from 'js-sha3'
import {getRecetaXml} from '../lib/Api'

const $ = window.$

export default class SearchRecipe extends Component {
  state = {
    run: '',
    pin: '',
    loading: false
  }

  submit = (e) => {
    e.preventDefault()
    let {run, pin} = this.state
    let hash = sha3_256(run.toUpperCase() + ':' + pin)

    this.setState({loading: true})
    getRecetaXml(hash).then(r => {
      this.setState({loading: false})
      this.props.onRecipe(r)
    }).catch(e => {
      this.setState({loading: false})
      this.props.onError(e)
    })
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
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <form onSubmit={this.submit}>
                <div className="form-group">
                  <label htmlFor="run">RUN</label>
                  <input id="run" className="form-control" data-validation="rut" onChange={this.onChange} disabled={this.state.loading} value={this.state.run} required/>
                  <div className="invalid-feedback">El rut no es valido.</div>
                </div>
                <div className="form-group">
                  <label htmlFor="pin">Pin</label>
                  <input id="pin" className="form-control" onChange={this.onChange} value={this.state.pin} disabled={this.state.loading} required/>
                  <div className="invalid-feedback">El pin es requerido.</div>
                </div>
                <button className="btn btn-primary btn-block" disabled={this.state.loading}>Consultar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
