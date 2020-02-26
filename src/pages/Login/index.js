import React, { Component } from "react";
import Home from '../../Home'
import Logo from "../../logo.jpg"
import "./Login.css";

var error = ""

export default class Login extends Component {
  //**constructor method in React.Component to initial state
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      roleAuthen:""
    };
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    
  }
 // Set uaername password when html form on change
  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  };

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }
  //**check role when  click login
  async handleClick(evt) {
    const dataReq = {username : this.state.username, password : this.state.password}
     //warp json packet
    const ResponseUser = await fetch('/logonTrakcare' , {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataReq)
    })
    const bodyRoleUser = await ResponseUser.json()
    //maxedit
    console.log(bodyRoleUser)
    //Set state
    await this.setState({roleAuthen : bodyRoleUser})
    sessionStorage.setItem('Authentication', this.state.roleAuthen)
    sessionStorage.setItem('checkLogin', '1')
    this.renderHome()
    window.location.reload()
  }

  //-------------------------------------------render UI----------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------
  renderHome(){
    return <Home />
  }
  //**render method in React.Component
  render() {
    //**authentication is failed
    if(sessionStorage.getItem('checkLogin')==1){ 
      error = "Username or Password incorrect"
    }
    return(
      <section className="hero is-fullheight Login">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="columns is-centered">
              <div className="box">
                <div className='is-flex  is-center'>
                <figure className='image is-128x128'><img src={Logo} /></figure>
                </div>
                <a className="navbar-item navbar-brand " ><center><font color="990099" size = "5"> Dental Dashboard </font></center></a>
                <h2 className="has-text-danger">{error}</h2>
                <form >
                  <div className="field">
                    <div className="control">
                    <h1><font color="#595955">Username</font></h1>
                      <input className="input is-large" type="text" required={true} placeholder="Your User"  onChange={this.handleUserChange}/>
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <h1><font color="#595955">Password</font></h1>
                      <input className="input is-large" type="password" required={true} placeholder="Your Password" onChange={this.handlePassChange} />
                    </div>
                    <br />
                  </div>
                  <a className="button is-block is-large color" onClick={this.handleClick}>Login</a>
                </form>
                </div>               
            </div>
          </div>
        </div>
      </section>
    )
  }
  //********************************************************************************************************************
}