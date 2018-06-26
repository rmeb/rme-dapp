import React, { Component } from 'react';
import {HashRouter as Router, Route, Redirect, Link} from 'react-router-dom'
import {Dashboard, Settings, Login, CreateAccount} from './screens'
import Header from './components/Header'
import Battery from './components/Battery'

import session from './lib/Session'

import './App.css';

class App extends Component {
  logout = (e) => {
    session.logout()
    window.$('#exitModal').modal('toggle')
  }

  render() {
    return (
      <Router>
        <div className="container">
          <Route exact path="/" component={Login}/>
          <Route exact path="/account" component={CreateAccount}/>
          <PrivateRoute path="/private" component={Header}/>
          <div className="cs-body-margin">
            <PrivateRoute path="/private" component={BatteryPanel}/>
            <PrivateRoute path="/private/dashboard" component={Dashboard}/>
            <PrivateRoute path="/private/settings" component={Settings}/>
          </div>
          <ExitModal onClick={this.logout}/>
        </div>
      </Router>
    );
  }
}

const BatteryPanel = ({balance, network}) => (
  <div className="row mb-3 justify-content-end">
    <div className="col-sm-12">
      <Battery balance={balance} version={network}/>
    </div>
  </div>
)

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => session.valid() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{pathname: "/", state: { from: props.location }}}/>
    )
  }/>
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
