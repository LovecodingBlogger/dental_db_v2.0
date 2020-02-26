/**
 * @file index.js
 * @author Kitsana Panja (561997001@crru.ac.th)
 * @brief Dental Dashboard (Router module get data from API send to component)
 * @version 1.0
 * @date 2019-11-28
 * 
 * @copyright Copyright (c) 2019
 * 
 */

import React, {Component} from 'react'
import socketIOClient from 'socket.io-client';
import { Switch, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Schedule from '../pages/Schedule'
import Logout from '../pages/Logout'

const  endpoint  =  "http://localhost:8080";
const socket = socketIOClient(endpoint);

export default class test extends Component{
  
/**
 * @brief component will mount retived data from backend server
 * 
 * @param[]	queue
 * @return
 */
  async componentWillMount() {

    //New API
    const responseCareProvider = await fetch('/careProvider');
    const responseAppointment = await fetch('/patientAppointment');
    const responseService = await fetch('/service');  
    const responseRoomDetail = await fetch('/roomDetail');
    const responseStatusPatient = await fetch('/patientStatus');

    const responseCareProviderService = await fetch('/careProviderService');

    const responseCareProviderWorkload = await fetch('/careProviderWorkload');

    const bodyCareProvider = await responseCareProvider.json();
    const bodyAppointment = await responseAppointment.json();
    const bodyService = await responseService.json();
    const bodyCareProviderService = await responseCareProviderService.json();
    const bodyRoomDetail = await responseRoomDetail.json();
    const bodyStatusPatient = await responseStatusPatient.json();
    const bodyCareProviderWorkload = await responseCareProviderWorkload.json();

    //console.log("--------------LOGD---------------")
    //console.log(bodyStatusPatient)

    await this.setState({resource : bodyCareProvider})
    await this.setState({data : bodyAppointment})
    await this.setState({services : bodyService}) 
    await this.setState({ResourceServices : bodyCareProviderService})
    await this.setState({roomDetail : bodyRoomDetail})
    await this.setState({statusPatients : bodyStatusPatient})
    await this.setState({CareProviderWorkload: bodyCareProviderWorkload})
    await this.returnBlinkPatient()
    await this.setAlarmTime()

  }
/**
 * @brief Listen data from socket event emit from backend server
 * 
 * @param[]
 * @return
 */
  componentDidMount(){
    //When recive namespech dataRoomDetail from server
    socket.on("dataRoomDetail", async data => {
      await this.setState({ response: data })
      //Call function getRoomDetail update props component
      await this.getRoomDetail()
    });

    socket.on("hello", async data => {
      console.log(data)
    });

    //Received patient status when get event call from OPD Queue
    socket.on("StatusPatient", async data => {
      await this.setState({ response: data })
      await this.getStatusPatient()
    });

    //** call api each 40s from trakcare
    this.timerID = setInterval(() => 
      this.getData(),
      60000
    ) 
  }

  componentWillUnmount(){
    //tear down the timer
    clearInterval(this.timerID);
  }

  //Call this function update data from trakcare
  async getData(){

    //Get all resource schedule old format
    const responseAppointment = await fetch('/patientAppointment');
    const bodyAppointment = await responseAppointment.json();
    await this.setState({data : bodyAppointment})
    //socket.emit('dataSchedule', this.state.data)

    //Get patient status
    const responseAppointment1 = await fetch('/patientStatus');
    const bodyAppointment1 = await responseAppointment1.json();
    await this.setState({statusPatients : bodyAppointment1})
    
    await  this.setAlarmTime()
    await this.returnBlinkPatient()

  }

  //Call this funtion get room detail info from API
  async getRoomDetail(){

    const {response} = this.state
    //When status room data is update. It will get data from database
    if(response === "update"){
      const responseAppointment = await fetch('/roomDetail');
      const bodyAppointment = await responseAppointment.json();
      await this.setState({roomDetail : bodyAppointment})
      console.log(bodyAppointment)
      //If not or room is first register. it can push status room data to state
    }else {
      const responseAppointment = await fetch('/roomDetail');
      const bodyAppointment = await responseAppointment.json();
      await console.log(bodyAppointment)
      await this.setState({roomDetail : bodyAppointment})
    }

    //Patient icon is process
    await this.returnBlinkPatient()

  }

  //Call this funtion when recive status update for set state statusPatients
  async getStatusPatient(){

    const {statusPatients} = this.state
    const {response} = this.state
    //When status room data is update. It will get data from database
    if(response === "update"){
      console.log('---- I Recive ----')
      const responseAppointment = await fetch('/patientStatus');
      const bodyAppointment = await responseAppointment.json();
      await this.setState({statusPatients : bodyAppointment})
      console.log(statusPatients)
      
      //If not or room is first register. it can push status room data to state
    }else {
      statusPatients.push(response)
    }

    await this.setAlarmTime()
    await this.returnBlinkPatient()
    
  }

  //Constructor method in React.Component for initial state
  constructor(props){
    super(props)  
    this.state = {
      resource: [],
      data:[],
      room:[],
      services:[],
      bookmark:'',
      ResourceServices:[],
      CareProviderWorkload:[]

    };
    this.renderDashboard = this.renderDashboard.bind(this)
    this.renderSchedule = this.renderSchedule.bind(this)
  }

  //Process patient icon when the room has patient
  returnPatient(){
    const {statusPatients} = this.state
    const {showBlinkPatient} = this.state
    var statusRoomCSS = []
    if(statusPatients!=null){
      for(var i=0; i<30; i++){
        if(showBlinkPatient[i]=="icon has-text-centered is-medium blink") {
          statusRoomCSS[i] = "fas fa-2x fa-user"
        } else{
          statusRoomCSS[i] = ""
        }
      }
      statusPatients.map((item) => {
        if(item.status==="Processing"){
          statusRoomCSS[item.room-1] = "fas fa-2x fa-user"
        }
      })
    }
    this.setState({showPatient:statusRoomCSS}) 
  }

  //Process patient blink icon when patient not into the room after register about 10 minute
  returnBlinkPatient(){
    const {statusPatients} = this.state
    var statusRoomCSS = []
    var currentDate = new Date()
    for(var i=0; i<30; i++){
      statusRoomCSS[i] = "icon has-text-centered is-medium"
    }
    if(statusPatients!=null){
        statusPatients.map((item) => {
            //Patient register have time stamp in records. and status is Register
            if(item.time_register!=null && item.status === "Arrived"){

              //If patient register get time appointment
              var timeAppointment = item.time_appointment.split(":")
              var alarmParam = new Date()
              alarmParam.setHours(timeAppointment[0])
              alarmParam.setMinutes(timeAppointment[1])
              alarmParam.setMinutes(alarmParam.getMinutes() + 15)

              if( this.state.data.test!==undefined &&  this.state.data.test !== null){
                this.state.data.test.map((data) => {
                  if(data.resourceSchedule!=undefined) {
                    data.resourceSchedule.map((itemdata) => {
                      if(currentDate >= alarmParam && item.status === "Arrived" && itemdata.patientId == item.patient_id){
                        statusRoomCSS[item.room-1] = "icon has-text-centered is-medium blink"
                      }
                    })
                  }
                })
              }

            }else{
              //patient no register
            }
        })
    }
    this.setState({showBlinkPatient:statusRoomCSS})
    this.returnPatient()
  }

  //Set time schedule and status of patient from trakcare in state and send for dashboard
  setAlarmTime(){
    var numberRoom = 30
    var alarmTime = [[]]
    var time = []
    var checkResource

    for(var z=0; z<numberRoom; z++){
      
      checkResource = 0
      time = []
      var resource = this.getResource(z)
      
      const {statusPatients} = this.state
      if( this.state.data.test != undefined){
        this.state.data.test.map((obj) => {
          //Check resource checkin in the room
          if (obj.resourceId == resource) {
            checkResource++

            obj.resourceSchedule.map((item) => {
          
              function search(things) {
                return things.patient_id === item.patientId;
              }
              var itemStatusPatient = this.state.statusPatients.find(search)
              if(itemStatusPatient!=undefined){
                time[item.id] = {time: item.timeAppointment, patient: item.patientId, status: itemStatusPatient.status}
                //console.log('LOGD: '+ item.id +' ' + item.patientId + ' '+ item.patientName)
              }

            })
            
          }
        })

        //Check resource check in the room
        if(checkResource>0){
          alarmTime[z] = time
        }
      }else{
        
      }
    }

    this.setState({alarmTime:alarmTime})
    //console.log(alarmTime)

  }

  //Find resource each as room
  getResource(id){
    var returnResource = null
    if(this.state.roomDetail!=null){
      this.state.roomDetail.map((item)=> {
        if(item.room == id+1) {
          if(item.status !== 'Out'){
            returnResource = item.resource_id
          }
        }
      })
    }
    return returnResource
  }

  //###################### render UI ######################
  renderDashboard(){
    return(
        <Dashboard CareProviderWorkload={this.state.CareProviderWorkload} showBlinkPatient={this.state.showBlinkPatient} resource={this.state.resource} data={this.state.data} alarmTime={this.state.alarmTime} roomDetail={this.state.roomDetail} statusPatients={this.state.statusPatients} showPatient={this.state.showPatient} ResourceServices={this.state.ResourceServices}/>
    )
  }
  renderSchedule(){
    return(
        <Schedule resource={this.state.resource} data={this.state.data} services={this.state.services} ResourceServices={this.state.ResourceServices}/>
    )
  }

  //Find case routing path // --> set component name  component={this.renderSchedule}
  render(){
    return(
      <Switch>   
        <Route exact path="/"  component={this.renderDashboard} /> 
        <Route exact path="/schedule" component={this.renderSchedule} />
        <Route exact path="/dashboard"  component={this.renderDashboard} />
        <Route exact path="/dashboard/*"  component={this.renderDashboard} />
        <Route exact path="/logout" component={Logout} />
      </Switch>
    )
  }
}