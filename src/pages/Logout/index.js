import React, {Component} from 'react'
import Index from '../../index'

export default class logout extends Component {
  //**componentWillMount method in React.Component
  //**clear session authentication
  componentWillMount(){
    sessionStorage.clear()
  }
  //-------------------------------------------render UI----------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------
  render(){
    //**render first Index page
    return(
      <Index />
    )
  }
  //********************************************************************************************************************
}
  

