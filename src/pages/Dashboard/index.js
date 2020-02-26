import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Popover, Button,Card  } from 'antd';
import 'antd/dist/antd.css';
import TableButtom from './table'
import TableSearch from './tableSearch'
import SearchResource from './searchResource';
import '../Dashboard/dashboard.css';

let idForTableTotal = 0;
var rows = []

class Dashboard extends Component {
  //Constructor method in React.Component for initial state
  constructor(props){
    super(props)  
    this.state = {
      resource: [],
      data:[],
      room:[
        {
          status : "",
          triger : ''
        }
      ],
      showPatient:[],  
      value:'',
      alarmTime:''  ,
      filedResource:'',
      clickRoomState:0,
    };
    //onConfirmResource
    this.clickRoom = this.clickRoom.bind(this);
    this.onConfirm= this.onConfirm.bind(this);
  }
  //ComponentWillMount method in React.Component to clear time interval
  componentWillMount() {}

  //ComponentDidMount method in React.Component for time interval for check alarm
  componentDidMount(){
    this.checkAlarmClock()
    this.timerID = setInterval(
      () => this.checkAlarmClock(),
      60000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  //Change state event click
  clickRoom(){
    this.setState({clickRoomState : 1})
    //console.log(this.state.clickRoomState)
  }
  changeTrigerRoom(){
    this.setState({clickRoomState : 0})
  }
  
  onConfirm(order) {
    if(order!=null && order!='' && order!=undefined){
      if(this.state.filedResource != order){
        this.setState({filedResource : order})
      }
    }else{
      this.setState({filedResource : ''})
      this.setState({clickRoomState : 0})
    }
  }

  //Process flashing room (room alarm when patient not register more than 15 minute)
  checkAlarmClock(){
    var noti = []
    var currentDate = new Date()
    if(this.props.alarmTime!=null){
      for(var i=0; i<this.props.alarmTime.length; i++){
        var hasFlash = 0
        //ex. noti[idx]= "flashing"
        let aTime = this.props.alarmTime[i]
        for(let ptr in aTime){
          //console.log(aTime[ptr])
          let splitAlarmTime = aTime[ptr].time.split(":")
          let alarmDate = new Date()
          alarmDate.setHours(splitAlarmTime[0])
          alarmDate.setMinutes(splitAlarmTime[1])
          alarmDate.setMinutes(alarmDate.getMinutes() + 15)
          console.log('LOGD: '+aTime[ptr].patient +' '+ aTime[ptr].status+' '+alarmDate)

          //Check alarm time in array if patient not register 15 minute time 
          if(currentDate >= alarmDate && hasFlash === 0 && aTime[ptr].status==="Booked") {
              //Set noti[index] to flashing for room alarm
              console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!')
              noti[i]= "flashing"
              hasFlash= 1
          }
        } 
      }
    }
    this.setState({notiFlashing : noti})
  }
  //------------------------ShowBalloon-FollowByRoom---------------------//
  //Show popup of the room id
  content (id){
    var Resource = this.getDoctorName(id)
    //console.log(Resource)
    if(Resource!=null){
      return (
        <div>
          <p>{Resource}</p>
        </div>
      )
    }else {
      return (
        <div>
          <div >Content</div>
        </div>
      )
    }
  };

  //-------------------Prepare-Data-for-show-bottom-table--------------------//
  //-------------------------------------------------------------------------//
  // show table in below of web page
  createData(room, resource, service, time,resource_id) {
    idForTableTotal += 1;
    return { idForTableTotal, room, resource, service, time,resource_id };
  }
  
  dataRoomTable = () => {
    idForTableTotal = 0
    rows = []
    if(this.props.roomDetail!=null){
      for(var i=0; i<this.props.roomDetail.length; i++){
        for(var j=0; j<this.props.data.test.length; j++){
          //console.log(this.props.data.test)
          for(var k=0; k<this.props.ResourceServices.ResourceService.length; k++){
            //Service from interface service master maxnote
            if(this.props.roomDetail[i].resource_id==this.props.data.test[j].resourceId&&this.props.roomDetail[i].resource_id==this.props.ResourceServices.ResourceService[k].Code){
            
              if(this.props.data.test[j].resourceSchedule!=null){
                var lengthService = this.props.ResourceServices.ResourceService[k].Services.length 
                var length = this.props.data.test[j].resourceSchedule.length
                let serviceGroup = this.props.ResourceServices.ResourceService[k].Services
                
                let sv = ''
                //get service only one set more detail
                for(let s in serviceGroup){
                  sv += serviceGroup[s].Service.toString()
                  sv += '...'
                  break
                }

                //rows.push(this.createData(this.props.roomDetail[i].room, this.props.roomDetail[i].resource, this.props.ResourceServices.ResourceService[k].Services[lengthService-1].NameService, this.props.roomDetail[i].schedule_time))
                rows.push(this.createData(this.props.roomDetail[i].room, this.props.roomDetail[i].resource, sv, this.props.roomDetail[i].schedule_time,this.props.roomDetail[i].resource_id))
              }
            }
          }
        }
      }
    }
  }

  //Calculate status each as room
  //ตรวจจำนวนผู้ป่วยในแต่ละห้องและระบุสถานะห้อง
  calStatusRoom(DoctorCode){
    let statusResource = ""

    if(this.props.CareProviderWorkload!=null){
      const result = this.props.CareProviderWorkload.filter((CarePro) => {
        return CarePro.CarpCode = DoctorCode
      })
      //console.log(result[0])
      if(result[0]!=undefined){
        let workload = result[0].Workload
        if(workload==0.0){ //Pink
          statusResource = "buttonDashboard t-NoPatient"
        }else if(workload>0&&workload<=0.3){  //Green
          statusResource = "buttonDashboard t-avaliable"
        }else if(workload>0.3&&workload<=0.6){ //Yellow
          statusResource = "buttonDashboard t-SomeAppointment"
        }else if(workload>0.6&&workload<=1.0){ //Orange
          statusResource = "buttonDashboard t-FullAppointment"
        }else if(workload>1.0){ //Red
          statusResource = "buttonDashboard t-Overbooking"
        }
        return statusResource
      }else{
        return null
      }
      
    }else{
      return null
    }
   
  }

  //Process status between flashing status and normal status
  // ส่งค่าสถานะของห้อง
  //Referrent room number calculate 
  returnStatus(id){
    var resource = this.getResource(id)
    var statusResource = this.calStatusRoom(resource)
    var statusService = "READY"
    if(this.state.notiFlashing !== null && this.state.notiFlashing !== undefined){
      if(this.props.roomDetail != null){
        for(var i=0; i<this.props.roomDetail.length; i++){

          //Set flag status
          if(this.state.notiFlashing[id]=="flashing" && this.props.roomDetail[i].room == id+1 ){
            return "buttonflashing"
          }

          var currentTime = new Date()
          var scheduleTime = new Date()
          var splitScheduleTime = this.props.roomDetail[i].schedule_time.split("-")
          var splitScheduleHrMin = splitScheduleTime[1].split(":")
          scheduleTime.setHours(splitScheduleHrMin[0])
          scheduleTime.setMinutes(splitScheduleHrMin[1])
          /*if(currentTime>scheduleTime){
              statusService = "END"
          }*/
          //console.log(this.props.roomDetail[i].status)
          if(this.props.roomDetail[i].status == 'Out'){
              statusService = "END"
          }
        }
      }
    }

    if (statusResource == null || statusService == "END") {
        return "buttonDashboard t-empty"
    }else {
      return statusResource
    }

  }

  //**find resource each as room
  //Search room id and map data of the room id
  getResource(id){
    
    var returnResource = null
    if(this.props.roomDetail!=null){

      this.props.roomDetail.map((item)=> {
        if(item.room == id+1) {
          returnResource = item.resource_id
        }
      })
    }
    return returnResource
  }

  getDoctorName(id){
    
    var returnResource = null
    if(this.props.roomDetail!=null){

      this.props.roomDetail.map((item)=> {
        if(item.room == id+1) {
          returnResource = item.resource
        }
      })
    }
    return returnResource
  }

  //------------------------------------------render UI------------------------------------------
  //---------------------------------------------------------------------------------------------
  renderUI(){
    if(this.props.showPatient!=null && this.props.showBlinkPatient!=null){
      const hoverContent = <div style={{ width: 500 ,background:'red',padding: '0 50px',border: '15px solid green'}}>This is hover content.</div>;
      return(  
        <Router>          
          <div className="has-text">
            <div className="columns">
              <div className="column is-two-fifths">
                <div className="columns is-desktop ">
                  {/*&nbsp;&nbsp;&nbsp;*/}
                  <div className="column">
                    <Link to ="/dashboard/0"><Popover placement="bottomLeft" content={this.content(0)}><button onClick={this.clickRoom}  className={this.returnStatus(0)}>Room 1 <br/><span className={this.props.showBlinkPatient[0]}><i className={this.props.showPatient[0]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/1"><Popover placement="bottomLeft" content={this.content(1)}><button onClick={this.clickRoom} className={this.returnStatus(1)}>Room 2 <br/><span className={this.props.showBlinkPatient[1]}><i className={this.props.showPatient[1]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/2"><Popover placement="topLeft" content={this.content(2)}><button onClick={this.clickRoom} className={this.returnStatus(2)}>Room 3 <br/><span className={this.props.showBlinkPatient[2]}><i className={this.props.showPatient[2]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/3"><Popover placement="topLeft" content={this.content(3)}><button onClick={this.clickRoom} className={this.returnStatus(3)}>Room 4 <br/><span className={this.props.showBlinkPatient[3]}><i className={this.props.showPatient[3]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/4"><Popover placement="topLeft" content={this.content(4)}><button onClick={this.clickRoom} className={this.returnStatus(4)}>Room 5 <br/><span className={this.props.showBlinkPatient[4]}><i className={this.props.showPatient[4]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/5"><Popover placement="topLeft" content={this.content(5)}><button onClick={this.clickRoom} className={this.returnStatus(5)}>Room 6 <br/><span className={this.props.showBlinkPatient[5]}><i className={this.props.showPatient[5]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/6"><Popover placement="topLeft" content={this.content(6)}><button onClick={this.clickRoom} className={this.returnStatus(6)}>Room 7 <br/><span className={this.props.showBlinkPatient[6]}><i className={this.props.showPatient[6]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/7"><Popover placement="topLeft" content={this.content(7)}><button onClick={this.clickRoom} className={this.returnStatus(7)}>Room 8 <br/><span className={this.props.showBlinkPatient[7]}><i className={this.props.showPatient[7]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/8"><Popover placement="topLeft" content={this.content(8)}><button onClick={this.clickRoom} className={this.returnStatus(8)}>Room 9 <br/><span className={this.props.showBlinkPatient[8]}><i className={this.props.showPatient[8]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/9"><Popover placement="topLeft" content={this.content(9)}><button onClick={this.clickRoom} className={this.returnStatus(9)}>Room 10<br/><span className={this.props.showBlinkPatient[9]}><i className={this.props.showPatient[9]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/10"><Popover placement="topLeft" content={this.content(10)}><button onClick={this.clickRoom} className={this.returnStatus(10)}>Room 11<br/><span className={this.props.showBlinkPatient[10]}><i className={this.props.showPatient[10]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/11"><Popover placement="topLeft" content={this.content(11)}><button onClick={this.clickRoom} className={this.returnStatus(11)}>Room 12<br/><span className={this.props.showBlinkPatient[11]}><i className={this.props.showPatient[11]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/13"><Popover placement="topLeft" content={this.content(13)}><button onClick={this.clickRoom} className={this.returnStatus(13)}>Room 14<br/><span className={this.props.showBlinkPatient[13]}><i className={this.props.showPatient[13]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/14"><Popover placement="topLeft" content={this.content(14)}><button onClick={this.clickRoom} className={this.returnStatus(14)}>Room 15<br/><span className={this.props.showBlinkPatient[14]}><i className={this.props.showPatient[14]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/15"><Popover placement="topLeft" content={this.content(15)}><button onClick={this.clickRoom} className={this.returnStatus(15)}>Room 16<br/><span className={this.props.showBlinkPatient[15]}><i className={this.props.showPatient[15]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/16"><Popover placement="topLeft" content={this.content(16)}><button onClick={this.clickRoom} className={this.returnStatus(16)}>Room 17<br/><span className={this.props.showBlinkPatient[16]}><i className={this.props.showPatient[16]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/17"><Popover placement="topLeft" content={this.content(17)}><button onClick={this.clickRoom} className={this.returnStatus(17)}>Room 18<br/><span className={this.props.showBlinkPatient[17]}><i className={this.props.showPatient[17]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/18"><Popover placement="topLeft" content={this.content(18)}><button onClick={this.clickRoom} className={this.returnStatus(18)}>Room 19<br/><span className={this.props.showBlinkPatient[18]}><i className={this.props.showPatient[18]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/19"><Popover placement="topLeft" content={this.content(19)}><button onClick={this.clickRoom} className={this.returnStatus(19)}>Room 20<br/><span className={this.props.showBlinkPatient[19]}><i className={this.props.showPatient[19]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/20"><Popover placement="topLeft" content={this.content(20)}><button onClick={this.clickRoom} className={this.returnStatus(20)}>Room 21<br/><span className={this.props.showBlinkPatient[20]}><i className={this.props.showPatient[20]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/21"><Popover placement="topLeft" content={this.content(21)}><button onClick={this.clickRoom} className={this.returnStatus(21)}>Room 22<br/><span className={this.props.showBlinkPatient[21]}><i className={this.props.showPatient[21]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/22"><Popover placement="topLeft" content={this.content(22)}><button onClick={this.clickRoom} className={this.returnStatus(22)}>Room 23<br/><span className={this.props.showBlinkPatient[22]}><i className={this.props.showPatient[22]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/23"><Popover placement="topLeft" content={this.content(23)}><button onClick={this.clickRoom} className={this.returnStatus(23)}>Room 24<br/><span className={this.props.showBlinkPatient[23]}><i className={this.props.showPatient[23]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/24"><Popover placement="topLeft" content={this.content(24)}><button onClick={this.clickRoom} className={this.returnStatus(24)}>Room 25<br/><span className={this.props.showBlinkPatient[24]}><i className={this.props.showPatient[24]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/25"><Popover placement="topLeft" content={this.content(25)}><button onClick={this.clickRoom} className={this.returnStatus(25)}>Room 26<br/><span className={this.props.showBlinkPatient[25]}><i className={this.props.showPatient[25]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/26"><Popover placement="topLeft" content={this.content(26)}><button onClick={this.clickRoom} className={this.returnStatus(26)}>Room 27<br/><span className={this.props.showBlinkPatient[26]}><i className={this.props.showPatient[26]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/27"><Popover placement="topLeft" content={this.content(27)}><button onClick={this.clickRoom} className={this.returnStatus(27)}>Room 28<br/><span className={this.props.showBlinkPatient[27]}><i className={this.props.showPatient[27]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/28"><Popover placement="topLeft" content={this.content(28)}><button onClick={this.clickRoom} className={this.returnStatus(28)}>Room 29<br/><span className={this.props.showBlinkPatient[28]}><i className={this.props.showPatient[28]}></i></span></button></Popover></Link>
                    <Link to ="/dashboard/29"><Popover placement="topLeft" content={this.content(29)}><button onClick={this.clickRoom} className={this.returnStatus(29)}>Room 30<br/><span className={this.props.showBlinkPatient[29]}><i className={this.props.showPatient[29]}></i></span></button></Popover></Link>
                  </div>
                </div>
                <div className="columns is-mobile">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {<h3>Workload</h3>}
                </div>
                <div className="columns is-mobile" style={{border: 0, margin: 0, padding: 0}}>
                    &nbsp;
                  <div className="div-square"><center><div className="square empty"></div><p >Empty</p></center></div>
                  <div className="div-square"><center><div className="square noPatient"></div><p>No Patient</p></center></div>
                  <div className="div-square"><center><div className="square avaliable"></div><p>Avaliable</p></center></div>
                  <div className="div-square"><center><div className="square SomeAppointment"></div><p>Some Appointment</p></center></div>
                  <div className="div-square"><center><div className="square FullAppointment"></div><p>Full Appointment</p></center></div>
                  <div className="div-square"><center><div className="square Overbooking"></div><p>Overbooking</p></center></div>
                </div>
                {/*<a className="button is-active lable lable-empty">Empty</a>*/}
                {/*<a className="button is-active lable lable-NoPatient"><font color="#FFFFFF">No Patient</font></a>*/}
                {/*<a className="button is-active lable lable-Avaliable"><font color="#FFFFFF">Avaliable</font></a>*/}
                {/*<a className="button is-active lable lable-SomeAppointment"><font color="#FFFFFF">Some Appointment</font></a>*/}
                {/*<a className="button is-active lable lable-FullAppointment"><font color="#FFFFFF">Full Appointment</font></a>*/}
                {/*<a className="button is-active lable lable-Overbooking"><font color="#FFFFFF">Overbooking</font></a>*/}
              </div>
              <div className="column">
                <font className="has-text-weight-bold">Resource</font>
                {/*Search textbox  */}
                <div><SearchResource resource={this.props.resource} confirm={this.onConfirm}/></div>
                <TableSearch data={this.props.data} statusPatients={this.props.statusPatients} resourceScheduleStatus={this.props.resourceScheduleStatus} roomDetail={this.props.roomDetail} single={this.state.filedResource} trigerClickRoom={this.state.clickRoomState} view={this.changeTrigerRoom.bind(this)}/>
              </div> 
            </div>           
          <TableButtom rows={rows} resourceService={this.props.ResourceServices}/>
        </div> 
      </Router>
    )}
  }

  //Render method in React.Component
  render() {  
    if(this.props.data.test!=null){
      this.dataRoomTable()
    }
    return(
      <div className="background">{this.renderUI()}</div>      
    ) 
  }
  
}

export default Dashboard;
