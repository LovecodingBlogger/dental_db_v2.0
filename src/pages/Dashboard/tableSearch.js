import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import '../Dashboard/dashboard.css';
import Avatar from '@material-ui/core/Avatar';

import phoneIcon from '../Dashboard/phone.png';
import clockIcon from '../Dashboard/clock.png';

const styles = theme => ({
  root_1000: {
    width: 'auto',
    height: 450,
    flexGrow: 1,      
    marginTop: theme.spacing.unit * 3,
    overflow: 'auto',
    borderWidth: '2px',
    borderTopStyle:'solid',
    borderColor:'#ddd',  
  },
  root_1080: {
    width: 'auto',
    height: 400,
    flexGrow: 1,      
    marginTop: theme.spacing.unit * 3,
    overflow: 'auto',
    borderWidth: '2px',
    borderTopStyle:'solid',
    borderColor:'#ddd',  
  },
  root_800: {
    width: 'auto',
    height: 360,
    flexGrow: 0,      
    marginTop: theme.spacing.unit * 0,
    overflow: 'auto',
    borderWidth: '2px',
    borderTopStyle:'solid',
    borderColor:'#ddd',
   
  },
  headTable: {
    backgroundColor:"#990099",
    color: "#fff",
    top: 0,
    fontSize:'1.1em',
    border: 0,
    margin: 0,
    padding: 0
  },  
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      // backgroundColor: '#d9b3ff',
    },
  },
  small: {
    width: 10,
    height: 10,
  }
});
  
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 13,
    border: 0,
    margin: 1,
    padding: 10,
  },
}))(TableCell);

class tableSearch extends Component{

  //Constructor method in React.Component for initial state
  constructor(props){
    super(props)
  }

  //Check resolution of user and return styles
  checkResolution(){
    const { classes } = this.props;
    var resolutionRender = document.documentElement.clientHeight;
    if(resolutionRender<700){
      return classes.root_800
    }else if(resolutionRender<950){
      return classes.root_1000
    }else if(resolutionRender>960){
      return classes.root_1080
    }
  }

  //Find resource each as room
  returnResource(id){
    if(this.props.roomDetail!=null){
      for(var i=0; i<this.props.roomDetail.length; i++){
        if(this.props.roomDetail[i].room==id+1 && this.props.roomDetail[i].status!="End"){
          return this.props.roomDetail[i].resource_id
        }
      }
    }
  }

  //Render head table and size of table
  renderHeadTable(){
    const { classes } = this.props;
    var stylesRender = this.checkResolution()
    return(
        <Paper className={stylesRender}>
          <Table className={classes.table}>
            <TableHead className={classes.headTable}>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell className={classes.headTable}>Time</TableCell>
                <TableCell className={classes.headTable}>HN</TableCell>
                <TableCell className={classes.headTable}>Name</TableCell>
                <TableCell className={classes.headTable}>Gender</TableCell>
                <TableCell className={classes.headTable}>Service</TableCell>
                <TableCell className={classes.headTable}>Status</TableCell>
              </TableRow>
            </TableHead>
            {this.renderBodyTable()}
          </Table>
        </Paper>
    )
  }

  //Process body table by select render between search resource and click room
  renderBodyTable(){
    var check=0
    var icon =[],time=[],hn=[],name=[],gender=[],service=[],status=[],data=[]
    //console.log('LOGI:'+this.props.resourceScheduleStatus)
    if(this.props.data.test != undefined){
      
      this.props.data.test.map((d) => {
        
        if(this.props.single==d.resourceName){
          check=1;
          if(this.props.trigerClickRoom==1){
            //this.props.view()
          }
          //console.log(d.resourceName)
          if(d.resourceSchedule!=undefined){
            for(var i=0; i<d.resourceSchedule.length; i++){
              
              for(let ptr in this.props.resourceScheduleStatus){
                
                let resourceId = d.resourceId
                let patientId = d.resourceSchedule[i].patientId
                let timeAppointment = d.resourceSchedule[i].timeAppointment
                let patientStatusOfRecord = 'Blank()'
                for(let ptr in this.props.resourceScheduleStatus){
                  //console.log('LOGD: '+this.props.resourceScheduleStatus[ptr])
                  if(patientId == this.props.resourceScheduleStatus[ptr].patientId &&
                  resourceId  == this.props.resourceScheduleStatus[ptr].resourceId &&
                  timeAppointment == this.props.resourceScheduleStatus[ptr].timeAppointment){
                    //console.log('LOGD: '+patientId+' '+resourceId+' '+this.props.resourceScheduleStatus[ptr].statusId)
                    patientStatusOfRecord = this.props.resourceScheduleStatus[ptr].statusId
                  }
                }
                icon[i] = ''
                time[i] = d.resourceSchedule[i].timeAppointment
                hn[i] = d.resourceSchedule[i].patientId
                name[i] = d.resourceSchedule[i].patientName
                gender[i] = d.resourceSchedule[i].gender
                service[i] = d.resourceSchedule[i].serviceName
                status[i] = patientStatusOfRecord
              }
            }
          }
        }
      })

    }
    
    if(check==1){
      for(var i=0; i<time.length; i++){
        //data[i] = {time : time[i], service : service[i], patient : patient[i],patient : patient[i],status : status[i]}
        data[i] = {icon:icon[i], time : time[i], hn:hn[i], name:name[i], gender:gender[i], service:service[i],status: status[i]}
      }
      return(
          <TableBody>
            {data.map(item => {
             
              return(
                
                <TableRow key={item.patient} className="row">
                  <CustomTableCell>{item.icon}</CustomTableCell>
                  <CustomTableCell  style={{ width: 'auto' }}>{item.time}</CustomTableCell>
                  <CustomTableCell  style={{ width: 'auto' }}>{item.hn}</CustomTableCell>
                  <CustomTableCell  style={{ width: 'auto' }}>{item.name}</CustomTableCell>
                  <CustomTableCell  style={{ width: 'auto' }}>{item.gender}</CustomTableCell>
                  <CustomTableCell  style={{ width: 'auto' }}>{item.service}</CustomTableCell>
                  <CustomTableCell  style={{ width: 'auto' }}>{item.status}</CustomTableCell>
                </TableRow>
              )
            })}
          </TableBody>
      )
    }else if(this.props.trigerClickRoom){
      return(
          <Route path="/dashboard/:id" component={this.renderClickRoom}/>
      )
    }
  }

  //Find data room that click and render to body table
  renderClickRoom = ({ match }) => {
    //console.log(this.props.data.test)
    var dataRoom = []   
    var id = match.params.id
    var resource = this.returnResource(parseInt(id))
    for(var i=0; i<this.props.data.test.length; i++){
      
      if(resource==this.props.data.test[i].resourceId){
        if(this.props.data.test[i].resourceSchedule!=undefined){
          //console.log(this.props.data.test[i].resourceSchedule)
          //console.log(this.props.resourceScheduleStatus)
          //find to list of resource schedule
          for(var j=0; j<this.props.data.test[i].resourceSchedule.length; j++){
            
            let resourceId = this.props.data.test[i].resourceId
            let patientId = this.props.data.test[i].resourceSchedule[j].patientId
            let timeAppointment = this.props.data.test[i].resourceSchedule[j].timeAppointment
            let PatientStatusDesc = ''
            //onsole.log(this.props.statusPatients)
            for(let ptr in this.props.statusPatients){
              //console.log('LOGD: '+this.props.resourceScheduleStatus[ptr])
              if(patientId == this.props.statusPatients[ptr].patient_id &&
                resourceId  == this.props.statusPatients[ptr].resource_id &&
                timeAppointment == this.props.statusPatients[ptr].time_appointment){
                //console.log('LOGD: '+patientId+' '+resourceId+' '+this.props.resourceScheduleStatus[ptr].statusId)
                PatientStatusDesc = this.props.statusPatients[ptr].status
              } 
            }
            //dataRoom[j] = {time : this.props.data.test[i].resourceSchedule[j].timeAppointment, service : this.props.data.test[i].resourceSchedule[j].serviceName, patient : this.props.data.test[i].resourceSchedule[j].patientName,status : patientStatusOfRecord}
            dataRoom[j] = {
              icon:'mj',
              time : this.props.data.test[i].resourceSchedule[j].timeAppointment,
              hn : this.props.data.test[i].resourceSchedule[j].patientId,
              name : this.props.data.test[i].resourceSchedule[j].patientName,
              gender : this.props.data.test[i].resourceSchedule[j].gender,
              service : this.props.data.test[i].resourceSchedule[j].serviceName, 
              status : PatientStatusDesc
            }
        } 
      }
    }
  }

  

  return(
    <TableBody>
      {dataRoom.map(rows => {
         let time = rows.time.split(':')
         let time_str = time[0]+':'+time[1]
        return(
          
          <TableRow key={rows.hn} className="row" > 
      
            <CustomTableCell padding="checkbox">{this.GetIcon(+time[1])}</CustomTableCell> 
            <CustomTableCell align="left">{time_str}</CustomTableCell>
            <CustomTableCell align="left">{rows.hn}</CustomTableCell>
            <CustomTableCell align="left">{rows.name}</CustomTableCell>
            <CustomTableCell align="right">{rows.gender}</CustomTableCell>
            <CustomTableCell align="right">{rows.service}</CustomTableCell>
            <CustomTableCell align="right">{rows.status}</CustomTableCell>
            {/** edit this point show status*/}
          </TableRow>
        )
      })}
    </TableBody>
  )};

  GetIcon(time) {
    if (time == "00") {
      return <Avatar style={{maxWidth:25,maxHeight:25}} alt="Remy Sharp" src={clockIcon}></Avatar>;
    }else if(time != "00"){
      return <Avatar style={{maxWidth:25,maxHeight:25}} alt="Remy Sharp" src={phoneIcon}></Avatar>;
    }else{
      return;
    }
    
  }

  //Render method in React.Component
  render(){
    return(    
      <div>
        {this.renderHeadTable()} 
      </div>
    )
  }
}

export default withStyles(styles)(tableSearch) 
