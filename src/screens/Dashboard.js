import React, { Component } from 'react';
import SearchRecipe from '../components/SearchRecipe'
import {PRESCRIPTION} from '../utils/Routes'

export default class Dashboard extends Component {
  onSearch = (hash) => {
    this.props.history.push(PRESCRIPTION.replace(':hash', hash))
  }

  render() {
    return (
      <div>
        <h1 className="display-5 mb-4">Buscar Receta</h1>
        <SearchRecipe onSearch={this.onSearch} onError={this.props.onError}/>
      </div>
    );
  }
}
