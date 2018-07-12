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
    let {establecimiento, profesional, paciente, prescriptions, diagnosis, pacient_detail, farma_detail} = this.state
    return (
      <div>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-1">Establecimiento {establecimiento.name} - {establecimiento.deis}</h5>
                <small className="text-muted">Telefono: {establecimiento.phone} {establecimiento.email}</small>
                <p className="mb-1">{establecimiento.street} {establecimiento.street_number} - {establecimiento.depto} - {establecimiento.comuna}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-1">Profesional: {profesional.name} - {profesional.profession}</h5>
                <small className="text-muted">{profesional.document_type} {profesional.document}</small>
                <p className="mb-1">{profesional.super_salud} {profesional.colegio}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-1">Paciente: {paciente.name}</h5>
                <small className="text-muted">{paciente.document_type} {paciente.document}</small>
                <p className="mb-1">Telefono: {paciente.phone} {paciente.address} - {paciente.city}</p>
                <p className="mb-1">Fecha de nacimiento: {paciente.birthday} Peso: {paciente.weight}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
