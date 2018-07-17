import React, { Component } from 'react';
import {parseRecipeXml} from '../lib/SignService'

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
    contract: ''
  }

  componentDidMount() {
    let data = parseRecipeXml(this.props.recipe)
    if (data !== null) {
      this.setState(data)
    }
  }

  render() {
    let {establecimiento, profesional, paciente, prescriptions} = this.state
    return (
      <div>
        <div className="row">
          <div className="col-md-12 text-right">
            <label>{this.state.fecha}</label>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
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
        <div className="row mb-3">
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
         <div className="row mb-3">
           <div className="col-md-12">
             <div className="card">
               <div className="card-body">
                 <h5 className="card-title">Diagnostico</h5>
                 <p>{this.state.diagnosis}</p>
               </div>
             </div>
           </div>
         </div>
         <div className="row mb-3">
           <div className="col-md-12">
             <div className="card">
               <div className="card-body">
                 <h5 className="card-title">Indicaciones al paciente</h5>
                 <p>{this.state.pacient_detail}</p>
               </div>
             </div>
           </div>
         </div>
         <div className="row mb-3">
           <div className="col-md-12">
             <div className="card">
               <div className="card-body">
                 <h5 className="card-title">Indicaciones al farmaceutico</h5>
                 <p>{this.state.farma_detail}</p>
               </div>
             </div>
           </div>
         </div>
         <p className="h3">Prescripciones</p>
         <div className="row mb-3">
           <div className="col-md-12">
             <ul className="list-group">
               {prescriptions.map((drug, i) => (
                 <li key={i} className="list-group-item">{drug.codigo} {drug.dose} {drug.frequency} {drug.length}</li>
               ))}
            </ul>
           </div>
         </div>
      </div>
    )
  }
}
