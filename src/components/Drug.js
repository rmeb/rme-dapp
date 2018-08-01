import React, { Component } from 'react';
import {getFarmaco, isRestricted} from '../lib/Api'
import {despachar, recetados, despachado} from '../lib/Eth'

const $ = window.$

export default class Drug extends Component {
  state = {
    dci: '',
    forma: '',
    recetados: 0,
    despachados: 0,
    restricted: false,
    loading: true,
    dispensar: false,
    dispensing: false
  }

  componentDidMount() {
    this.load()
  }

  load = () => {
    let promises = []
    promises.push(getFarmaco(this.props.codigo))
    promises.push(recetados(this.props.codigo))
    promises.push(despachado(this.props.codigo))
    promises.push(isRestricted(this.props.codigo))
    Promise.all(promises).then(values => {
      console.log(values)
      let drug = values[0]
      this.setState({
        dci: drug.dci,
        forma: drug.forma_farmaceutica,
        recetados: parseInt(values[1], 10),
        despachados: parseInt(values[2], 10),
        restricted: values[3],
        loading: false})
    }).catch(e => {
      this.setState({loading: false})
      this.props.onError(e)
    })
  }

  dispensar = (data) => {
    this.setState({dispensing: true})
    despachar(this.props.password, this.props.codigo, data.quantity, data.amount_list, data.amount_payed).then(tx => {
      console.log(tx)
      this.load()
      this.setState({dispensing: false, dispensar: false})
      //this.props.pushAlert({type: 'success', message: 'Medicamento dispensado.'})
    }).catch(e => {
      this.setState({dispensing: false})
      this.props.onError(e)
    })
  }

  render() {
    if (this.state.loading) return <li className="list-group-item"><i className="fas fa-circle-notch fa-spin fa-2x"></i></li>
    return (
      <li className="list-group-item">
        <div className="d-flex justify-content-between">
          <h5 className="mb-1">{this.state.dci}</h5>
          <small className="text-muted">{this.state.despachados} / {this.state.recetados}</small>
        </div>
        <p className="mb-1">{this.props.dose} {this.state.forma} cada {this.props.frequency} por {this.props.length} Dias.</p>
        {this._renderButton()}
        <Dispensar onClick={this.dispensar}
          restricted={this.state.restricted}
          despachados={this.state.despachados}
          recetados={this.state.recetados}
          show={this.state.dispensar}
          disabled={this.state.dispensing}/>
      </li>
    )
  }

  _renderButton = () => {
    if (!this.props.allowed) return null
    if (this.props.password.length === 0) return (
      <button type="button" className="btn btn-success btn-sm" data-target="#passwordModal" data-toggle="modal"><i className="fas fa-lock"></i></button>
    )
    return (
      <button type="button" className="btn btn-success btn-sm"
        onClick={() => this.setState({dispensar: !this.state.dispensar})}
        disabled={this.state.restricted && this.state.despachados >= this.state.recetados}>Dispensar</button>)
  }
}

class Dispensar extends Component {
  state = {
    quantity: '',
    amount_payed: '',
    amount_list: '',
    error: ''
  }

  onClick = () => {
    let {quantity, amount_payed, amount_list} = this.state

    if (quantity.length === 0 | isNaN(quantity)) {
      $('#quantity').addClass('is-invalid')
      return
    }
    let q = parseInt(quantity, 10)
    if (q && this.props.restricted > (this.props.recetados - this.props.despachados)) {
      $('#quantity').addClass('is-invalid')
      this.setState({error: 'Medicamento restringido, quedan ' + (this.props.recetados - this.props.despachados)  + ' por dispensar.'})
      return
    }

    if (amount_list.length === 0 | isNaN(amount_list)) {
      $('#amount_list').addClass('is-invalid')
      return
    }
    if (amount_payed.length === 0 | isNaN(amount_payed)) {
      $('#amount_payed').addClass('is-invalid')
      return
    }

    this.props.onClick({
      quantity: q,
      amount_payed: parseInt(amount_payed, 10),
      amount_list: parseInt(amount_list, 10)
    })
    this.setState({quantity: '', amount_list: '', amount_payed: '', error: ''})
  }

  onChange = (e) => {
    e.preventDefault()
    let id = e.target.id
    let value = e.target.value

    if (value.length === 0 || isNaN(value)) {
      $('#' + id).addClass('is-invalid')
    } else {
      $('#' + id).removeClass('is-invalid')
    }

    this.setState({[e.target.id]: e.target.value})
  }

  render() {
    if (!this.props.show) return null
    return (
      <div className="form-row mt-3">
        <div className="form-group col-md-4">
          <label>Cantidad</label>
          <input id="quantity" className="form-control" value={this.state.quantity} onChange={this.onChange} disabled={this.props.disabled}/>
          <div className="invalid-feedback">{this.state.error.length !== 0 ? this.state.error : 'Ingrese la cantidad.'}</div>
        </div>
        <div className="form-group col-md-4">
          <label>Precio de lista</label>
          <input id="amount_list" className="form-control" value={this.state.amount_list} onChange={this.onChange}  disabled={this.props.disabled}/>
          <div className="invalid-feedback">Ingrese el precio.</div>
        </div>
        <div className="form-group col-md-4">
          <label>Precio pagado</label>
          <input id="amount_payed" className="form-control" value={this.state.amount_payed} onChange={this.onChange}  disabled={this.props.disabled}/>
          <div className="invalid-feedback">Ingrese el precio.</div>
        </div>
        <button className="btn btn-danger btn-block" type="button" onClick={this.onClick} disabled={this.props.disabled}><LoadingLabel label="Dispensar" loading={this.props.disabled}/></button>
      </div>
    )
  }
}

const LoadingLabel = ({loading, label}) => (
  <div>{loading ? <i className="fa fa-circle-notch fa-spin"></i> : label}</div>
)
