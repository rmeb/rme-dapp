import React, { Component } from 'react';
import {HashRouter as Router, Route, Link} from 'react-router-dom'
import {Dashboard, Settings, Login, CreateAccount, Recipe} from './screens'
import {DASHBOARD, HEADER, LOGIN, CREATE_ACCOUNT, SETTINGS, RECIPE} from './utils/Routes'
import Header from './components/Header'
import Battery from './components/Battery'
import Error from './components/Error'
import Loading from './components/Loading'

import session from './lib/Session'

import './App.css';

class App extends Component {
  state = {
    error: '',
    alerts: [],
    loading: true
  }

  componentDidMount() {
    session.init().then(() => this.setState({loading: false})).catch(this.onError)
  }

  logout = (e) => {
    session.logout()
    window.$('#exitModal').modal('toggle')
  }

  pushAlert = (alert) => {
    this.setState({alerts: [...this.state.alerts, alert]})
  }

  onError = (e) => {
    console.error(e)
    this.setState({error: e.message ? e.message : e, loading: false})
    window.scrollTo(0, 0)
  }

  render() {
    if (this.state.loading) return <Loading />
    return (
      <Router>
        <div className="container">
          <PublicRoute path={HEADER} component={Header} alerts={this.state.alerts}/>
          <div className="cs-body-margin">
            <PrivateRoute path={HEADER} component={BatteryPanel}/>
            <PublicRoute path={HEADER} component={Error} message={this.state.error} onClick={() => this.setState({error: ''})}/>
            <PublicRoute exact path={LOGIN} component={Login}/>
            <PublicRoute exact path={CREATE_ACCOUNT} component={CreateAccount}/>
            <PublicRoute exact path={DASHBOARD} component={Dashboard} onError={this.onError}/>
            <PublicRoute exact path={RECIPE} component={Recipe} onError={this.onError} pushAlert={this.pushAlert}/>
            <PrivateRoute path={SETTINGS} component={Settings}/>
          </div>
          <ExitModal onClick={this.logout}/>
        </div>
      </Router>
    );
  }
}

const BatteryPanel = ({onError}) => (
  <div className="row mb-3 justify-content-end">
    <div className="col-sm-12">
      <Battery onError={onError} />
    </div>
  </div>
)

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => session.valid() ? (
      <Component {...props} {...rest}/>) : null }/>
);

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} {...rest}/>}/>
);

const ExitModal = ({onClick}) => (
  <div className="modal fade" id="exitModal" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Salir</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>¿Desea salir de la aplicación?</p>
        </div>
        <div className="modal-footer">
          <Link to="/" className="btn btn-primary" onClick={onClick}>Si</Link>
          <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
        </div>
      </div>
    </div>
  </div>
)

export default App;
