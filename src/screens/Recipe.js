import React, { Component } from 'react';
import Drug from '../components/Drug'
import {Link} from 'react-router-dom'
import {parseRecipeXml} from '../lib/SignService'
import {getRecetaXml} from '../lib/Api'
import {isAllowed, initDespachoContract} from '../lib/Eth'
import {moment} from '../utils/Formats'
import {DASHBOARD} from '../utils/Routes'

export default class SearchRecipe extends Component {
  state = {
    establecimiento: {
      name: '',
      deis: '',
      phone: '',
      email: '',
      street: '',
      street_number: '',
      depto: '',
      comuna: ''
    },
    profesional:  {
      name: '',
      document_type: '',
      document: '',
      profession: '',
      super_salud: '',
      colegio: ''
    },
    paciente: {
      name: '',
      document_type: '',
      document: '',
      birthday: '',
      weight: '',
      size: '',
      address: '',
      city: '',
      phone: ''
    },
    prescriptions: [],
    diagnosis: '',
    fecha: '',
    pacient_detail: '',
    farma_detail: '',
    contract: '',
    loading: true,
    allowed: false,
    password: ''
  }

  componentDidMount() {
    isAllowed().then(allowed => this.setState({allowed})).catch(console.error)
    getRecetaXml(this.props.match.params.hash).then(parseRecipeXml).then(recipe => {
      initDespachoContract(recipe.contract)
      this.setState({...recipe, loading: false})
    }).catch(e => {
      this.setState({loading: false})
      this.props.onError(e)
    })
  }

  render() {
    if (this.state.loading) return <div className="d-flex justify-content-center"><i className="fas fa-circle-notch fa-spin fa-4x"></i></div>
    let {establecimiento, profesional, paciente, prescriptions} = this.state
    return (
      <div>
        <h1 className="display-5 mb-4">Receta</h1>
        <div className="row">
          <div className="col-md-12 text-right">
            <label>{moment(parseInt(this.state.fecha, 10)).format('DD/MM/YYYY')}</label>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-6 mb-2">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-1">Establecimiento {establecimiento.name} - Deis: {establecimiento.deis}</h5>
                <small className="text-muted">Telefono: {establecimiento.phone} {establecimiento.email}</small>
                <p className="mb-1">{establecimiento.street} {establecimiento.street_number} - {establecimiento.comuna} - {establecimiento.depto}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-1">Profesional: {profesional.name} - {profesional.profession}</h5>
                <small className="text-muted">Codigo salud: {profesional.super_salud} Codigo colegio: {profesional.colegio}</small>
                <p className="mb-1">{profesional.document_type} {profesional.document}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-1">Paciente: {paciente.name}</h5>
                <small className="text-muted">Telefono: {paciente.phone}, {paciente.address} - {paciente.city}</small>
                <p className="mb-1">{paciente.document_type}: {paciente.document}</p>
                <p className="mb-1">Fecha de nacimiento: {paciente.birthday} Peso: {paciente.weight} Talla: {paciente.size}</p>
              </div>
            </div>
          </div>
        </div>
         <div className="row mb-2">
           <div className="col-md-12">
             <div className="card">
               <div className="card-body">
                 <h5 className="card-title">Diagnostico</h5>
                 <p>{this.state.diagnosis}</p>
               </div>
             </div>
           </div>
         </div>
         <div className="row mb-2">
           <div className="col-md-12">
             <div className="card">
               <div className="card-body">
                 <h5 className="card-title">Indicaciones al paciente</h5>
                 <p>{this.state.pacient_detail}</p>
               </div>
             </div>
           </div>
         </div>
         <div className="row mb-2">
           <div className="col-md-12">
             <div className="card">
               <div className="card-body">
                 <h5 className="card-title">Indicaciones al farmaceutico</h5>
                 <p>{this.state.farma_detail}</p>
               </div>
             </div>
           </div>
         </div>
         <p className="h3 mb-3">Prescripciones</p>
         <div className="row mb-2">
           <div className="col-md-12">
             <ul className="list-group">
               {prescriptions.map((drug, i) => (
                 <Drug key={i} {...drug} allowed={this.state.allowed} password={this.state.password} onError={this.props.onError}/>
               ))}
            </ul>
           </div>
         </div>
         <Link className="btn btn-primary btn-block mb-1" to={DASHBOARD}>Volver</Link>
         <RequirePassword password={this.state.password} onClick={this.dispensar} onChange={e => this.setState({password: e.target.value})}/>
      </div>
    )
  }
}

const RequirePassword = ({onClick, password, onChange}) => (
  <div className="modal fade" id="passwordModal" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Requiere Contraseña</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Contraseña</label>
            <input id="password" className="form-control" type="password" value={password} onChange={onChange} />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={onClick}>Continuar</button>
        </div>
      </div>
    </div>
  </div>
)
