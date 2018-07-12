import React, { Component } from 'react';
import SearchRecipe from '../components/SearchRecipe'
import Recipe from '../components/Recipe'

export default class Dashboard extends Component {
  state = {
    recipe: null
  }

  onRecipe = (result) => {
    this.setState({recipe: result.receta})
  }

  render() {
    return (
      <div>
        <h1 className="display-5 mb-4">Receta</h1>
        {this.state.recipe === null ?
          <SearchRecipe onRecipe={this.onRecipe} /> :
          <Recipe recipe={this.state.recipe}/>}
      </div>
    );
  }
}
