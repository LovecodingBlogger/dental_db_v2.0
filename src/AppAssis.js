import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Routing from './routes'

class App extends Component {
  //-------------------------------------------render UI----------------------------------------------------------------
  renderOnPage(){
    return (
      <div className="my-app">
        <nav class = "navbar" className="navbar is-light" role="navigation" aria-label="main navigation">
          <div className="container">
            <div className="navbar-brand">
              <a className="navbar-item" ><font color="BE1BE8" size = "5"> Dental Dashboard </font></a>        
            </div>
            <div className="navbar-menu">
              <div className="navbar-end">            
                <NavLink to="/dashboard" activeClassName="is-active" className="navbar-item">Dashboard</NavLink>       
                <NavLink className="navbar-item" to="/logout" >Logout <i className="fab fa-github"></i></NavLink>
              </div>
            </div>
          </div>
        </nav>
        <Routing />
        </div>
    )
  }

  //Render method in React.Component
  render() {
    return (
      <div>{this.renderOnPage()}</div>
    )
  }
}

export default App
