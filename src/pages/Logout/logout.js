import React, {Component} from 'react'
import Logo from "../../logo.jpg"
import './Logout.css'

export default class render extends Component {
    render(){
        return(
            <section class="hero login is-fullheight">
                <div class="hero-body">
                    <div class="container has-text-centered">
                        <div class="columns is-centered">
                            <div class="box">
                                <div class='is-flex  is-center'>
                                    <figure className='image is-128x128'><img src={Logo} /></figure>
                                </div>
                                <a className="navbar-item navbar-brand" ><font color="990099" size = "5"> Dental Dashboard </font></a> 
                                <div class="field">
                                    <div class="control">
                                        <br />
                                        <h1 class="subtitle has-text-black">&nbsp;&nbsp;&nbsp;<font size = "4">You have signed out of your account.</font></h1>
                                    </div>
                                </div>
                                <form >
                                    <a href='/' class="button is-block color is-large ">Login</a>
                                </form>
                            </div>               
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}