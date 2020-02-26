import React, {Component} from 'react'
import Login from '../pages/Login'
import App from '../App'
import AppAssis from '../AppAssis'
import Logout from '../pages/Logout/logout'
import { BrowserRouter } from 'react-router-dom'

export default class Home extends Component {
    //**authentication and render follow role user
    checkRender(){
        //Session check log in success.
        if((!sessionStorage.getItem('Authentication'))||(sessionStorage.getItem('Authentication')==='wrong')){
            if(window.location.pathname==='/logout'){
                return(
                    //Show logout page //call function 
                    <div>{this.renderPageLogout()}</div>
                )
            }else {
                return(
                    //Show login page //call function
                    <div>{this.renderPageLogin()}</div>
                )
            }
        //Get data from session
        }else if(sessionStorage.getItem('Authentication')==='admin') {   
            //this.processAjaxData(window.location.href,'/dashboard')
            return(
                //Login success goto home page
                <div>{this.renderPageApp()}</div>
            )
        }else if(sessionStorage.getItem('Authentication')==='assistant'){
            this.processAjaxData(window.location.href,'/dashboard')
            return(
                <div>{this.renderPageAppAssis()}</div>
            )
        }
    }
    //**method change url
    processAjaxData(response, urlPath){
        window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
    }
    //-------------------------------------------render UI--------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------------
    renderPageLogout(){
        return(
            <Logout />
        )
    }
    renderPageLogin(){
        return(
            <Login />
        )
    }
    renderPageApp(){
        return(
            <BrowserRouter>
              <App />
            </BrowserRouter>
        )
    }
    renderPageAppAssis(){
        return(
            <BrowserRouter>
              <AppAssis />
            </BrowserRouter>
        )
    }
    //**render method in React.Component
    render(){
        //Call function return html tag render on web page
        return(
           <div>{this.checkRender()}</div>
        )
    }
    //******************************************************************************************************************
}
