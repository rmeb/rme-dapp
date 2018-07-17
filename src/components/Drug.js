import React, { Component } from 'react';
import {getFarmaco} from '../lib/Api'

export default class Drug extends Component {
  state = {
    dci: '',
    forma: '',
    loading: true
  }

  componentDidMount() {
    getFarmaco(this.props.codigo).then(drug => this.setState({dci: drug.dci, forma: drug.forma_farmaceutica, loading: false}))
  }

  render() {
    if (this.state.loading) return <li className="list-group-item"><i className="fas fa-circle-notch fa-spin fa-2x"></i></li>
    return (
      <li className="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>{this.state.dci}</strong>, {this.props.dose} {this.state.forma} cada {this.props.frequency} por {this.props.length} Dias.
        </div>
        {this.props.allowed ? <button type="button" className="btn btn-danger btn-sm">Dispensar</button> : null}
      </li>
    )
  }
}
