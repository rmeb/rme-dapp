import React, {Component} from 'react'
import {DASHBOARD, SETTINGS} from '../utils/Routes'
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
    //let path = this.props.history.location.pathname
    return (
      <nav className="navbar fixed-top navbar-expand-md navbar-dark cs-bg-primary">
        <Link className="navbar-brand" to={DASHBOARD}>Receta Medica</Link>
        <button id="toggler" className="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown active">
              <a className="nav-link dropdown-toggle cs-pointer" id="navbarDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <i className="fas fa-user-circle fa-lg"></i> {session.get_data().rut}
              </a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a className="dropdown-item cs-pointer" onClick={e => this.navigate(SETTINGS)}><i className="fas fa-cog"></i> Ajustes</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item cs-pointer" data-toggle="modal" data-target="#exitModal"><i className="fas fa-sign-out-alt"></i> Salir</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}
