import React from 'react';
import '../../../node_modules/bulma-extensions/bulma-checkradio/dist/css/bulma-checkradio.min.css'

//This class is interval time manage and send data to component
class radioButton extends React.Component{
  //Constructor method in React.Component for initial state
  constructor(props){
    super(props)  
    this.state = {        
      optionsChecked: ['morning','afternoon','evening']           
    };  
  }

  //Event select interval time
  changeEvent(event) {
    let checkedArray = this.state.optionsChecked;
    let selectedValue = event.target.value;    
    if (event.target.checked === true) {
      checkedArray.push(selectedValue);
        this.setState({
          optionsChecked: checkedArray
        });            
    } else {    
      let valueIndex = checkedArray.indexOf(selectedValue);
      checkedArray.splice(valueIndex, 1);
      this.setState({
        optionsChecked: checkedArray
      });
    }
    this.props.confirm(this.state.optionsChecked)    
  }
  //################# render UI #################
  render(){
      let checkBoxArray = ['morning','afternoon','evening'];
      var outputCheckboxes = checkBoxArray.map(function(string, i){
        return (<div style={{display:'flex'}} className="field" key={i}><input className="is-checkradio is-circle is-info" type="checkbox" defaultChecked value={string} id={'string_' + i} onChange={this.changeEvent.bind(this)} /><label htmlFor={'string_' + i}>{string}</label></div>)
      }, this);
      return(
        <div className="columns is-desktop">{outputCheckboxes}</div>
      )
  }
}

export default radioButton