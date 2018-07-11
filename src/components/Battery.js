import React, {Component} from 'react'
import {network, net_label, get_accounts, getWeiBalance,
  getTransaction} from '../lib/Eth'
import {refund} from '../lib/Api'

const WEIMAX = 10000000000000000

export default class Baterry extends Component {
  state = {
    network: '',
    balance: 0,
    recharging: false
  }

  componentDidMount() {
    network().then(netId => {
      this.setState({network: net_label(netId)})
    }).catch(console.error)
    this.refresh()
    this._timer = setInterval(this.refresh, 3000)
  }

  componentWillUnmount() {
    clearInterval(this._timer)
    clearInterval(this._refundTimer)
  }

  refresh = () => {
    let accounts = get_accounts()
    if (accounts.length > 0) {
      getWeiBalance('0x' + accounts[0]).then(balance => {
        this.setState({balance})
      }).catch(console.error)
    }
  }

  submit = (e) => {
    e.preventDefault()
    window.$('#refundModal').modal('toggle')
    let account = get_accounts()[0]
    this.setState({recharging: true})
    refund(account).then(data => {
      this._refundTimer = setInterval(() => {
        getTransaction(data.txHash).then(tx => {
          console.log('getTx', tx)
          if (tx.blockNumber !== null) {
            this.setState({recharging: false})
            clearInterval(this._refundTimer)
          }
        }).catch(e => {
          console.error('[recharge]', e)
          this.setState({recharging: false})
        })
      }, 15000)
    }).catch(e => {
      console.error('[recharge]', e)
      this.setState({recharging: false})
      this.props.onError(e)
    })
  }

  render() {
    return (
      <div className="d-flex justify-content-end align-items-center">
        <span className="mr-2">{this.state.network}</span>
        {this.state.recharging ?
          <i className="fas fa-battery-bolt fa-2x"/>:
          <a data-toggle="modal" data-target="#refundModal" className="cs-pointer">
            <i className={"fas fa-2x fa-battery-" + batteryLevel(this.state.balance / WEIMAX)} />
          </a>
        }
        <RefundModal submit={this.submit}/>
      </div>
    )
  }
}

const RefundModal = ({submit}) => (
  <div className="modal fade" id="refundModal" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Cargar Bateria</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>¿Desea cargar la bateria?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={submit}>Si</button>
          <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
        </div>
      </div>
    </div>
  </div>
)



function batteryLevel(fuel) {
  let battery = 'full'
  if (fuel < 0.1) {
    battery = 'slash'
  } else if (fuel < 0.3) {
    battery = 'quarter'
  } else if (fuel < 0.5) {
    battery = 'half'
  } else if (fuel < 0.8) {
    battery = 'three-quarters'
  }
  return battery
}
