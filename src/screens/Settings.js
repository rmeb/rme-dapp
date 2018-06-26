import React, { Component } from 'react';
import BN from 'bn.js'
import {get_accounts, getWeiBalance, from_wei, get_seed_words, sendTransaction} from '../lib/Eth'

export default class Settings extends Component {
  state = {
    accounts: [],
    balance: 0,
    words: [],
    password: ''
  }

  componentDidMount() {
    let accounts = get_accounts()
    if (accounts.length > 0) {
      getWeiBalance('0x' + accounts[0]).then(r => {
        this.setState({balance: r.toString()})
      }).catch(console.error)
    }
    this.setState({accounts})
  }

  showWords = (e) => {
    e.preventDefault()
    get_seed_words(this.state.password).then(words => this.setState({words})).catch(console.error)
    window.$('#wordsModal').modal('toggle')
  }

  sendEth = (e) => {
    console.log(this.state.balance)
    let balance = new BN(this.state.balance)
    let FEE = new BN('100000000000000')
    let value = balance.sub(FEE)
    let tx = {
      from: '0x' + this.state.accounts[0],
      to: '0x1f37eebA99aB6e7DCF98DDFA3aBDa96Fa3372a46',
      value,
      gas: 30000,
      data: '0x'
    }
    console.log(tx)
    sendTransaction('asdf', tx).then(console.log).catch(console.error)
  }

  onChange = (e) => {
    this.setState({[e.target.id]: e.target.value})
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row justify-content-center">
            <div className="col-md-3 mb-3">
              <div className="card">
                <div className="card-body text-center">
                  <h1 className="display-5">{from_wei(this.state.balance)}</h1>
                  <p>eth</p>
                </div>
              </div>
            </div>
            <div className="col-md-9 mb-3">
              <div className="card bg-light">
                <div className="card-header">Direcciones</div>
                <ul className="list-group list-group-flush text-center">
                  {this.state.accounts.map((a, i) => (
                    <li key={i} className="list-group-item">0x{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="card bg-light">
                <div className="card-body">
                  <button className="btn btn-danger btn-block" data-toggle="modal" data-target="#wordsModal">Mostrar Seed Words</button>
                  {/*<button className="btn btn-danger" onClick={this.sendEth}>Recuperar</button>*/}
                  {this.state.words.length === 0 ? null :
                    <div className="card mt-3">
                      <div className="card-body">
                        <p className="card-text">{this.state.words}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <WordsModal submit={this.showWords} value={this.state.password} onChange={this.onChange}/>
      </div>
    );
  }
}

const WordsModal = ({submit, value, onChange}) => (
  <form onSubmit={submit}>
    <div className="modal fade" id="wordsModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Seed Words</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" className="form-control" value={value} onChange={onChange}/>
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-danger">Mostrar</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </form>
)
