import React, { Component } from 'react'
import { NavLink,Redirect } from 'react-router-dom'
import Routing from './routes'
import Logo from "./Logo_Dental.png"

class App extends Component {
  //-------------------------------------------render UI----------------------------------------------------------------
  renderOnPage(){
    //Show menu in bugger when responsive
    document.addEventListener('DOMContentLoaded', () => {

      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    
      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {
    
        //Add a click event on each of them
        $navbarBurgers.forEach( el => {
          el.addEventListener('click', () => {
    
            //Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);
    
            //Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');
    
          });
        });
      }
    });
   
    //Render navbar
    return (
      <div>
        <nav className = "navbar" role="navigation" aria-label="main navigation">
        
          <div className="navbar-brand">
            <a className="navbar-item" >
              <img  src = {Logo}  />
            </a>
            <a role="button" className="navbar-burger" data-target="navMenu" aria-label="menu" aria-expanded="false" >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a> 
          </div>
          <div   id="navMenu" className="navbar-menu">
          <NavMenu />
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
//Class render navmenu
class NavMenu extends Component {
  render(){
    //https://github.com/ReactTraining/react-router/issues/1675
    return(
        <div className="navbar-end ">
          <Redirect from="/" to="/dashboard" />
          <NavLink to="/dashboard" activeClassName="is-active" className="navbar-item">Dashboard</NavLink>
          <NavLink to="/schedule" activeClassName="is-active" className="navbar-item">Schedule</NavLink>
          {/*<NavLink to="/test" activeClassName="is-active" className="navbar-item">Calendar</NavLink>*/}
          <NavLink className="navbar-item" to="/logout" >Logout &nbsp; <i className="fas fa-sign-out-alt"></i></NavLink>
        </div>
    )
  }
}
export default App

