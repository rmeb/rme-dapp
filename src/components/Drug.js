import React, { Component } from 'react';
import {getFarmaco} from '../lib/Api'

const $ = window.$

export default class Drug extends Component {
  state = {
    dci: '',
    forma: '',
    loading: true,
    dispensar: false
  }

  componentDidMount() {
    getFarmaco(this.props.codigo).then(drug => this.setState({dci: drug.dci, forma: drug.forma_farmaceutica, loading: false}))
  }

  dispensar = (data) => {
    console.log('dispensar', data)
    this.setState({dispensar: false})
  }

  render() {
    if (this.state.loading) return <li className="list-group-item"><i className="fas fa-circle-notch fa-spin fa-2x"></i></li>
    return (
      <li className="list-group-item d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>{this.state.dci}</strong>, {this.props.dose} {this.state.forma} cada {this.props.frequency} por {this.props.length} Dias.
          </div>
          {this.props.allowed ? <button type="button" className="btn btn-success btn-sm" onClick={() => this.setState({dispensar: !this.state.dispensar})}>Dispensar</button> : null}
        </div>
        <Dispensar onClick={this.dispensar} show={this.state.dispensar}/>
      </li>
    )
  }
}

class Dispensar extends Component {
  state = {
    quantity: '',
    amount_payed: '',
    amount_list: ''
  }

  onClick = () => {
    let {quantity, amount_payed, amount_list} = this.state

    if (quantity.length === 0 | isNaN(quantity)) {
      $('#quantity').addClass('is-invalid')
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
      quantity: parseInt(quantity, 10),
      amount_payed: parseInt(amount_payed, 10),
      amount_list: parseInt(amount_list, 10)
    }),
    this.setState({quantity: '', amount_list: '', amount_payed: ''})
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
          <input id="quantity" className="form-control" value={this.state.quantity} onChange={this.onChange} />
          <div className="invalid-feedback">Ingrese la cantidad.</div>
        </div>
        <div className="form-group col-md-4">
          <label>Precio de lista</label>
          <input id="amount_list" className="form-control" value={this.state.amount_list} onChange={this.onChange} />
          <div className="invalid-feedback">Ingrese el precio.</div>
        </div>
        <div className="form-group col-md-4">
          <label>Precio pagado</label>
          <input id="amount_payed" className="form-control" value={this.state.amount_payed} onChange={this.onChange} />
          <div className="invalid-feedback">Ingrese el precio.</div>
        </div>
        <button className="btn btn-danger btn-block" type="button" onClick={this.onClick}>Dispensar</button>
      </div>
    )
  }
}
/*
const Modal = ({onClick, onChange, quantity, amount_payed, amount_list}) => (
  <div className="modal fade" id={id} tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Dispensar Medicamento</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Cantidad</label>
            <input id="quantity" className="form-control" value={quantity} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Precio de lista</label>
            <input id="amount_list" className="form-control" value={amount_list} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Precio pagado</label>
            <input id="amount_payed" className="form-control" value={amount_payed} onChange={onChange} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={onClick}>Dispensar</button>
        </div>
      </div>
    </div>
  </div>
)*/
