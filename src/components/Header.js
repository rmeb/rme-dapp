import React, {Component} from 'react'
import {DASHBOARD, SETTINGS, LOGIN} from '../utils/Routes'
import {Link} from 'react-router-dom'
import session from '../lib/Session'

export default class Header extends Component {
  navigate = (to) => {
    window.$('#navbarNav').collapse('hide');
    if (to !== this.props.history.location.pathname) {
      this.props.history.push(to)
    }
  }

  render() {
    //let alerts = this.props.alerts
    return (
      <nav className="navbar fixed-top navbar-expand-md navbar-dark cs-bg-primary">
        <Link className="navbar-brand" to={DASHBOARD}>Receta Medica</Link>
        <button id="toggler" className="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {session.valid() ? <Private navigate={this.navigate}/> : <Public navigate={this.navigate}/>}
          </ul>
        </div>
      </nav>
    )
  }
}

const Private = ({navigate}) => (
  <li className="nav-item dropdown active">
    <a className="nav-link dropdown-toggle cs-pointer" id="navbarDropdown" role="button" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="false">
      <i className="fas fa-user-circle fa-lg"></i> {session.get_data().rut}
    </a>
    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
      <a className="dropdown-item cs-pointer" onClick={e => navigate(SETTINGS)}><i className="fas fa-cog"></i> Ajustes</a>
      <div className="dropdown-divider"></div>
      <a className="dropdown-item cs-pointer" data-toggle="modal" data-target="#exitModal"><i className="fas fa-sign-out-alt"></i> Salir</a>
    </div>
  </li>
)

const Public = ({navigate}) => (
  <li className="nav-item active">
    <Link to={LOGIN} className="nav-link d-flex align-items-center" aria-expanded="false">
      <i className="fas fa-sign-in-alt fa-lg mr-2"></i>Iniciar Sesion
    </Link>
  </li>
)
/*
const Alerts = ({alerts}) => (
  <li className={"nav-item dropdown" + (alerts.length > 0 ? ' active' : '')}>
    <a className="nav-link dropdown-toggle cs-pointer" id="navbarDropdown" role="button" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="false">
      <i className="fas fa-bell fa-lg"></i> {alerts.length}
    </a>
    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
      <h6 className="dropdown-header">Alertas</h6>
      <div className="dropdown-divider"></div>
      {alerts.map((a, i) => (
        <a className="dropdown-item cs-pointer"><i className="far fa-bell"></i> {a.message}</a>
      ))}
    </div>
  </li>
)
*/
