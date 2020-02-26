import React from 'react';
import Calendar from 'react-calendar'
import TableCom from './table';
import SearchResource from './searchResource';
import SearchService from './searchService';
import SelectTime from './selectTime';

class test extends React.Component {
  //Constructor method in React.Component for initial state
  constructor(props){
    super(props)  
    this.state = {
      date: new Date(),
      expandedRows:[],   
      rows:[],
      services:[],
      ResourceServices:[],
      resourceScheduleHistory:[],
      data:[],
      dateSelect:[],
      optionsChecked: ['morning','afternoon','evening']              
    };  
    this.onClickDay = this.onClickDay.bind(this)
  }

  //Set resource from props to state
  onConfirmResource = (order) => {
    this.setState({singleResource:order})
  }
  //Set service from props to state
  onConfirmService = (order) => {
    this.setState({singleService:order})
  }
  //Set interval time from props to state
  onConfirmSelectTime = (order) => {
    this.setState({optionsChecked:order})
  }

  //Set onclick date to state
  async onClickDay(dateValue){
    
    var date = {day : dateValue.getDate(), month : dateValue.getMonth()+1, year : dateValue.getFullYear()}
    await this.setState({dateSelect:date})
    let today = this.state.date;
    let dd = today.getDate();
    let MM = today.getMonth()+1;
    (dd<10)? dd='0'+ dd:dd;
    (MM<10)? MM='0'+ MM:MM; 
    let yyyy = today.getFullYear(); 
    //console.log(dd+' '+MM+' '+yyyy)

    let dt = dd+'/'+MM+'/'+yyyy
    const payload = await fetch('/resourceScheduleHistory?date='+dt);
    const body= await payload.json();
    await this.setState({resourceScheduleHistory : body})
    
    //console.log(this.state.resourceScheduleHistory)
    let date_ob = new Date();
    // current date
    // adjust 0 before single digit date
    let date1 = ("0" + date_ob.getDate()).slice(-2);
  
    // current month
    let month1 = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  
    // current year
    let year1 = date_ob.getFullYear();
    // prints date in YYYY-MM-DD format
    //console.log(year + "-" + month + "-" + date);
    let cur_date = date1+'/'+month1+'/'+year1

    if(dt === cur_date){
      await this.setState({data : this.props.data})
    }else{
      await this.setState({data : body})
    }
    
  }

  //Initial current date
  onChange = date => this.setState({ date })

  //############################# render UI #############################
  runTable(){

    if(this.state.data.test!=null){
      //console.log(this.state.data.test.length)
      //console.log('----------- LOGD HISTORY -----------')
      //return(
        //<TableCom resourceScheduleStatus={this.props.resourceScheduleStatus} optionsChecked={this.state.optionsChecked} singleService={this.state.singleService} singleResource={this.state.singleResource} data={this.props.data} services={this.props.services} ResourceServices={this.props.ResourceServices}/>
        /*<TableCom 
          statusPatients={this.state.statusPatients}
          optionsChecked={this.state.optionsChecked} 
          singleService={this.state.singleService} 
          singleResource={this.state.singleResource} 
          data={this.state.data} 
          services={this.props.services} 
          ResourceServices={this.props.ResourceServices}
        />*/
      //)
    }else if(this.props.data.test!=null&&this.props.services.services!=null){
      //console.log('----------- LOGD CURRENT DATE -----------')
      return(
        <TableCom 
          statusPatients={this.state.statusPatients}
          optionsChecked={this.state.optionsChecked} 
          singleService={this.state.singleService} 
          singleResource={this.state.singleResource} 
          data={this.props.data} 
          services={this.props.services} 
          ResourceServices={this.props.ResourceServices}
        />
      )
    }
  }  

  render() {
    return (       
      <div className="columns"> 
        &nbsp;&nbsp;
        <div className="column is-one-quarter">    
          <br/>      
          <center><Calendar onChange={this.onChange} locale="en-EN" value={this.state.date} onClickDay={this.onClickDay} /></center>
          <br/><font className="has-text-weight-bold">Resource</font>
          <div><SearchResource resource={this.props.resource} confirm={this.onConfirmResource}/></div>
          <font className="has-text-weight-bold">Service</font>
          <div><SearchService services={this.props.services} confirm={this.onConfirmService}/></div>
          <font className="has-text-weight-bold">Time</font>
          <br/><br/>
          <div><SelectTime confirm={this.onConfirmSelectTime} /></div>
        </div>                
        &nbsp;&nbsp;<div className="column is-three-quarters">{this.runTable()}</div>
      </div>   
    );
  }
}

export default  test
