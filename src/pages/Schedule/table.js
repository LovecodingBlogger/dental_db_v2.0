import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
    root_1080: {
      width: '99%',
      height: 880,
      flexGrow: 1,      
      marginTop: theme.spacing.unit * 2.6,
      overflow: 'auto',
      borderWidth: '0px',
    },
    root_800: {
      width: '98%',
      height: 568,
      flexGrow: 1,      
      marginTop: theme.spacing.unit * 2.6,
      overflow: 'auto',
      borderWidth: '0px',
    },
    root_1000: {
      width: '98%',
      height: 825,
      flexGrow: 1,      
      marginTop: theme.spacing.unit * 2.6,
      overflow: 'auto',
      borderWidth: '0px',
    },
    headTable: {
      position: 'sticky',
      top: 0,
      color: '#FFFFFF',
      backgroundColor : '#990099',
      minWidth : '340px',
      border: 0,
      padding: 0,
      margin: 0,
      textAlign: 'center',
    },  
    headTableTime: {
      position: 'sticky',
      top: 0,
      color: '#FFFFFF',
      backgroundColor : '#990099',
    },
    tableCell:{
      backgroundColor:"#1D5A7F",
      position: 'sticky',    
      left: 3
    },
    table: {
      minWidth: 600,
    },
    row: {
        backgroundColor: '#d9b3ff'
    },
    divider: {
      height: theme.spacing.unit * 2,
    },
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    }, 
    tableTimeStyle:{
      position: 'sticky',    
      left: 0,
      top: 0,
      width: '150px',
      color: '#FFFFFF',
      backgroundColor : '#990099',
    },
  });
  const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  var idForTableTotal = 0
  var checkHeader = 0
  
  //Check flags search filed
  var check=0

class table extends React.Component {

  //Constructor method in React.Component for initial state
  constructor(props){
      super(props)
      this.state = {
        date: new Date(),
        expandedRows:[],
        rows:[],
        preData:[],
        counter: 0,
      };
      this.handleClick = this.handleClick.bind(this)
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

  componentWillReceiveProps (nextProps){
    
    //console.log('=========-==============>>> ')
    //console.log(nextProps.data.test)
    
    /*if(nextProps.data.test !== this.state.preData && nextProps.data.test !== undefined){
      this.setState({preData: nextProps.data.test});
      console.log('-----------LOGD >> ')
      console.log(nextProps.data.test)
      this.createData()
    }*/

  }

  //################ Prepare data of 4 case and cut data follow interval time ################ 
  //Splice Interval Time
  spliceTime(datasource){
    var data = datasource
    if(this.props.optionsChecked.length===2){
      if((this.props.optionsChecked[0]=='morning'&&this.props.optionsChecked[1]=='afternoon')||(this.props.optionsChecked[1]=='morning'&&this.props.optionsChecked[0]=='afternoon')){
        data.splice(40,53)
      }else if((this.props.optionsChecked[0]=='morning'&&this.props.optionsChecked[1]=='evening')||(this.props.optionsChecked[1]=='morning'&&this.props.optionsChecked[0]=='evening')){
        var pause = []
        for(let i=0; i<data.length; i++){
          pause.push(data[i])
        }
        data.splice(20,53)
        for(let i=40; i<pause.length; i++){
          data.push(pause[i])
        }
      }else if((this.props.optionsChecked[0]=='afternoon'&&this.props.optionsChecked[1]=='evening')||(this.props.optionsChecked[1]=='afternoon'&&this.props.optionsChecked[0]=='evening')){
        data.splice(0,20)
      }
    }else if(this.props.optionsChecked.length===1){
      if(this.props.optionsChecked=='morning'){
        data.splice(20,53)
      }else if(this.props.optionsChecked=='afternoon'){
        data.splice(0,20)
        data.splice(20,28)
      }else {
        data.splice(0,40)
      }
    }else if(this.props.optionsChecked.length===0){

      data.splice(0,53)
    }
    return data
  }

	handleClick() {
	  this.setState({
		  counter: this.state.counter + 1
	  })
  }
  
  //Initial time
  createTime() {
    var data = []
    idForTableTotal = 0;
    var hr =7, min = 0, count = 0;
    for(var z=0; z<53; z++){
      idForTableTotal+=1
      if(count===4){
        hr++
        count=0
        min=0
      }
      if(hr<10){
        if(min===0){
          data[z] = {idForTableTotal,time:"0"+hr+":"+min+"0",code:[],patient:[],service:[],resource:[],status:[],id:[]}
        }else {
          data[z] = {idForTableTotal,time:"0"+hr+":"+min,code:[],patient:[],service:[],resource:[],status:[],id:[]}
        }
      }else{
        if(min===0){
          data[z] = {idForTableTotal,time:hr+":"+min+"0",code:[],patient:[],service:[],resource:[],status:[],id:[]}
        }else {
          data[z] = {idForTableTotal,time:hr+":"+min,code:[],patient:[],service:[],resource:[],status:[],id:[]}
        }
      }
      min+=15
      count++
    }
      return data
  }

  //Initial data for show all schedule on table : case 1
  async createData() {
    //this.state.rows = await this.createTime()
    idForTableTotal = 0;
    var hr = 7, min = 0, count = 0;
    for(var z=0; z<53; z++){
      idForTableTotal+=1
      if(count===4){
        hr++
        count=0
        min=0
      }
      if(hr<10){
        if(min===0){
          this.state.rows[z] = {idForTableTotal,time:"0"+hr+":"+min+"0",code:[],patient:[],service:[],resource:[],status:[],id:[]}
        }else {
          this.state.rows[z] = {idForTableTotal,time:"0"+hr+":"+min,code:[],patient:[],service:[],resource:[],status:[],id:[]}
        }
      }else{
        if(min===0){
          this.state.rows[z] = {idForTableTotal,time:hr+":"+min+"0",code:[],patient:[],service:[],resource:[],status:[],id:[]}
        }else {
          this.state.rows[z] = {idForTableTotal,time:hr+":"+min,code:[],patient:[],service:[],resource:[],status:[],id:[]}
        }
      }
      min+=15
      count++
    }
    
    for(var i=0; i<this.props.data.test.length; i++){
      for(var j=0; j<this.state.rows.length; j++){
        if(this.props.data.test[i].resourceSchedule!=undefined){
          for(var k=0; k<this.props.data.test[i].resourceSchedule.length ;k++){

            let patientStatusOfRecord = 'Booked'
          
            if(this.state.rows[j].time===this.props.data.test[i].resourceSchedule[k].timeAppointment){

              let timeOfService = parseInt(this.props.data.test[i].resourceSchedule[k].timeOfService)
              if(timeOfService <= 15){
                let length = this.state.rows[j].code.length;
                this.state.rows[j].code[length] = this.props.data.test[i].resourceSchedule[k].patientId
                this.state.rows[j].patient[length] = this.props.data.test[i].resourceSchedule[k].patientName
                this.state.rows[j].service[length] = this.props.data.test[i].resourceSchedule[k].serviceName
                this.state.rows[j].resource[length] = this.props.data.test[i].resourceName
                this.state.rows[j].status[length] = this.props.data.test[i].resourceSchedule[k].timeOfService+ ' ' + parseInt(this.props.data.test[i].resourceSchedule[k].timeOfService)/15
                this.state.rows[j].id[length] = i //ตำแหน่งที่เจอ
              }else{
                let num = parseInt(timeOfService/15)
                for(let mj = j; mj < (j + num); mj++){
                  let length = this.state.rows[mj].code.length;
                  this.state.rows[mj].code[length] = this.props.data.test[i].resourceSchedule[k].patientId
                  this.state.rows[mj].patient[length] = this.props.data.test[i].resourceSchedule[k].patientName
                  this.state.rows[mj].service[length] = this.props.data.test[i].resourceSchedule[k].serviceName
                  this.state.rows[mj].resource[length] = this.props.data.test[i].resourceName
                  this.state.rows[mj].status[length] = this.props.data.test[i].resourceSchedule[k].timeOfService+ ' ' + parseInt(this.props.data.test[i].resourceSchedule[k].timeOfService)/15
                  this.state.rows[mj].id[length] = i
                }
              }
            
            }

          }
        }
      }
      
    }
  
    //console.log(this.state.rows)

    //console.log(this.props.optionsChecked)
    await this.spliceTime(this.state.rows)
  }

  //Case 2 : Search resource
  prepairDataSearchResource(){
    var data = []
    data = this.createTime()
    for(var i=0; i<this.props.data.test.length; i++){
      for(var j=0; j<data.length; j++){
        if(this.props.data.test[i].resourceSchedule!=undefined){
          for(var k=0; k<this.props.data.test[i].resourceSchedule.length ;k++){
            if(this.props.singleResource===this.props.data.test[i].resourceName){

              //Check time
              if(data[j].time===this.props.data.test[i].resourceSchedule[k].timeAppointment){
                
                let patientStatusOfRecord = 'Booked'
                let resourceId = this.props.data.test[i].resourceId
                let patientId = this.props.data.test[i].resourceSchedule[k].patientId
                let timeAppointment = this.props.data.test[i].resourceSchedule[k].timeAppointment
            
                data[j].code[0] = this.props.data.test[i].resourceSchedule[k].patientId
                data[j].patient[0] = this.props.data.test[i].resourceSchedule[k].patientName
                data[j].service[0] = this.props.data.test[i].resourceSchedule[k].serviceName
                data[j].resource[0] = this.props.data.test[i].resourceName
                data[j].status[0] = patientStatusOfRecord
                data[j].id[0] = 0

              }
            }
          }
        }
      }
    }

    data = this.spliceTime(data)
    return data
  }

  //Case 3 : Search service
  prepairDataSearchService(){

    //console.log("LOGD: search a service.")
    var data = []
    var header = this.SearchHeaderService()
    data = this.createTime()
    //console.log('-----------header children ------------')
    //console.log(header)
    //console.log('---------------------------------------')
    for(var i=0; i<this.props.data.test.length; i++){
      for(var j=0; j<header.length; j++){
        //Check Resource compair header of table
        if(this.props.data.test[i].resourceName===header[j].props.children){
          for(var k=0; k<data.length; k++){
            if(this.props.data.test[i].resourceSchedule!=undefined){
              for(var l=0; l<this.props.data.test[i].resourceSchedule.length ;l++){

                //Check time
                if(data[k].time===this.props.data.test[i].resourceSchedule[l].timeAppointment){

                  //console.log("LOGD: "+ data[k].time)
                  let patientStatusOfRecord = 'Booked'
                  let resourceId = this.props.data.test[i].resourceId
                  let patientId = this.props.data.test[i].resourceSchedule[l].patientId
                  let timeAppointment = this.props.data.test[i].resourceSchedule[l].timeAppointment
                  
                  if(this.props.data.test[i].resourceSchedule[l].serviceName == this.props.singleService){
                    var length = data[k].code.length;
                    data[k].code[length] = this.props.data.test[i].resourceSchedule[l].patientId
                    data[k].patient[length] = this.props.data.test[i].resourceSchedule[l].patientName
                    data[k].service[length] = this.props.data.test[i].resourceSchedule[l].serviceName
                    data[k].resource[length] = this.props.data.test[i].resourceName
                    data[k].status[length] = patientStatusOfRecord
                    data[k].id[length] = j
                  }

                }
              }

            }
          }
        }
      }
    }

    data = this.spliceTime(data)
    return data

  }

  //Case 4 : Search resource and service
  prepairDataSearchBoth(){
    checkHeader=0
    var data = []
    var header = this.SearchHeaderService()
    data = this.createTime()
    
    for(var i=0; i<this.props.data.test.length; i++){
      for(var j=0; j<header.length; j++){
        if(this.props.data.test[i].resourceName===header[j].props.children&&this.props.data.test[i].resourceName===this.props.singleResource){
          checkHeader=1
          for(var k=0; k<data.length; k++){
            if(this.props.data.test[i].resourceSchedule!=undefined){
              for(var l=0; l<this.props.data.test[i].resourceSchedule.length ;l++){
                if(data[k].time===this.props.data.test[i].resourceSchedule[l].timeAppointment){

                  //------------- Add patient status to field status ---------------------
                  let patientStatusOfRecord = 'Booked'
                  let resourceId = this.props.data.test[i].resourceId
                  let patientId = this.props.data.test[i].resourceSchedule[l].patientId
                  let timeAppointment = this.props.data.test[i].resourceSchedule[l].timeAppointment
              
                  if(this.props.data.test[i].resourceSchedule[l].serviceName == this.props.singleService){
                    data[k].code[0] = this.props.data.test[i].resourceSchedule[l].patientId
                    data[k].patient[0] = this.props.data.test[i].resourceSchedule[l].patientName
                    data[k].service[0] = this.props.data.test[i].resourceSchedule[l].serviceName
                    data[k].resource[0] = this.props.data.test[i].resourceName
                    data[k].status[0] = patientStatusOfRecord
                    data[k].id = j
                  }
                }
              }
            }
          }
        }
      }
    }

    data = this.spliceTime(data)
    return data

  }
  //***********************************************************************************************
  //---------------------------------push data to tag html-----------------------------------------
  //-----------------------------------------------------------------------------------------------
    
  //Create HTML TAG for render UI table
  renderItem(item,idx) {
    
    const {classes} = this.props
    const clickCallback = () => this.handleRowClick(item.idForTableTotal); 
    var itemRows = []    

    itemRows.push(<TableRow key={"normal"+item.idForTableTotal} className={classes.row} onClick={clickCallback}>{this.InsertCode(item)}</TableRow>)
    
    //Insert data to record html tag
    //Insert d for unique key
    if(this.state.expandedRows.includes(item.idForTableTotal)){
      itemRows.push(<TableRow key={"expanded"+item.idForTableTotal}>{this.InsertDetail(item)}</TableRow>)
    }
    
    return itemRows;

  }

  //Expand row Get row id on event click
  handleRowClick(rowId) {
      const currentExpandedRows = this.state.expandedRows;
      const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);     
      const newExpandedRows = isRowCurrentlyExpanded ? 
      currentExpandedRows.filter(id => id !== rowId) : 
      currentExpandedRows.concat(rowId);   
      this.setState({expandedRows : newExpandedRows});
  }

  //Validation Patient Code Add to rows
  InsertCode(item){
    console.log('###### INSERT CODE PROC ######')
    const { classes } = this.props;     
    var data = []

    //Insert key item.time
    data.push(<CustomTableCell key={item.time} className={classes.headTableTime,classes.flexContainer,classes.tableTimeStyle}>{item.time}</CustomTableCell>)
    
    //Data is null
    if(this.props.data.test.length === 0){

      data.push(<CustomTableCell key={'n'+item.time}></CustomTableCell>)

    }else{
    
      var IndexID = 0  
      if(check==0){
        if(item.id.length>1){
          for(var i=0; i<this.props.data.test.length; i++){
            if(item.id[IndexID]==i){
              ///console.log('------> '+item.id[IndexID])
              data.push(<CustomTableCell key={i}>{item.code[IndexID]}</CustomTableCell>)
              IndexID++//enter index have resource
            }else {
              data.push(<CustomTableCell key={i}></CustomTableCell>)
            }
          }
        }else {
          for(var i=0; i<this.props.data.test.length; i++){
            if(item.id==i){
              data.push(<CustomTableCell  key={i}>{item.code}</CustomTableCell>)
            }else {
              data.push(<CustomTableCell  key={i}></CustomTableCell>)
            }
          }
        }
      }else if(check==1||check==3){
        //Insert s for unique key
        data.push(<CustomTableCell key={'s'+item.idForTableTotal} >{item.code}</CustomTableCell>)
        for(var i=1; i<4; i++){
          data.push(<CustomTableCell key={i}></CustomTableCell>)
        }
      }else {
        var length = this.SearchHeaderService().length
        for(var i=0; i<length; i++){
          if(item.id[IndexID]==i){
            data.push(<CustomTableCell key={i}>{item.code[IndexID]}</CustomTableCell>)
            IndexID++
          }else {
            data.push(<CustomTableCell key={i}></CustomTableCell>)
          }
        }
      }
    }

    return data

  }

  //Show detail : service resource patient time
  InsertDetail(item){
    var data = []
    data.push(<CustomTableCell key={item.idForTableTotal}></CustomTableCell>)
    var IndexID = 0  
    if(check==0){
      if(item.id.length>1){ //multi resource
        for(var i=0; i<this.props.data.test.length; i++){
          if(item.id[IndexID]==i){ //validation id 
            if(item.service!=""){
              data.push(<CustomTableCell key={"detail"+i} style={{ width: 'auto' }}>{item.time+" "+item.code[IndexID]}<br />{item.patient[IndexID]}<br />{item.service[IndexID]}<br />{item.status[IndexID]}</CustomTableCell> )
            }
            IndexID++
          }else {
            data.push(<CustomTableCell key={"detail"+i}></CustomTableCell>)
          }
        }
      }else { //single resource
        for(var i=0; i<this.props.data.test.length; i++){
          if(item.id==i){
            if(item.service!=""){
              
              data.push(<CustomTableCell key={"detail"+i} style={{ width: 'auto' }}>{item.time+" "+item.code}<br />{item.patient}<br />{item.service} <br/>{item.status}</CustomTableCell> )
            }
          }else {
            data.push(<CustomTableCell key={"detail"+i}></CustomTableCell>)
          }
        }
      }
    }else if(check==1||check==3){
      for(var i=0; i<4; i++){
        if(item.id==i){
          if(item.service!=""){
          data.push(<CustomTableCell key={"detail"+i} style={{ width: 'auto' }}>{item.time+" "+item.code}<br />{item.patient}<br />{item.service} <br/>{item.status}</CustomTableCell> )
          }
        }else {
          //Disable this line show data in cell 0
          //data.push(<CustomTableCell key={i}></CustomTableCell>)
        }
      }
    }else {
      var length = this.SearchHeaderService().length
      for(var i=0; i<length; i++){
        if(item.id[IndexID]==i){
          if(item.service!=""){
            data.push(<CustomTableCell key={"detail"+i} style={{ width: 'auto' }}>{item.time+" "+item.code[IndexID]}<br />{item.patient[IndexID]}<br />{item.service[IndexID]}<br />{item.status[IndexID]}</CustomTableCell> )
          }
          IndexID++
        }else {
          data.push(<CustomTableCell key={"detail"+i}></CustomTableCell>)
        }
      }
    }
      return data
  }
  
  //Use in case : search service and resource both
  functionCheckHeader(){
    const { classes } = this.props;
    if(checkHeader===1){
      return <TableCell className={classes.headTable}>{this.props.singleResource}</TableCell>
    }else{
        return <TableCell className={classes.headTable}></TableCell>
    }
  }

  //Push resource on service that search in html tag
  SearchHeaderService(){
    const { classes } = this.props;
    var header = []
    var countHeader = 0
    //Insert Header if service same singleService
    console.log("######### ResourceServices ##########")
    console.log(this.props.ResourceServices.ResourceService);

    for(var i=0; i<this.props.ResourceServices.ResourceService.length; i++){
      //console.log(this.props.ResourceServices.ResourceService[i].Services)
      for(var j=0; j<this.props.ResourceServices.ResourceService[i].Services.length; j++){
        if(this.props.ResourceServices.ResourceService[i].Services[j].Service===this.props.singleService){            
          header.push(<TableCell className={classes.headTable}>{this.props.ResourceServices.ResourceService[i].Name}</TableCell>)
          countHeader++
        }
      }
    }
    if(countHeader<4){
      for(var i=header.length; i<4; i++){
        header.push(<TableCell className={classes.headTable}></TableCell>)
      }
    }

    return header
  }
  
  //*************calculate case of table********************
  //maxnote check filter textbox and option select
  //check1 search resource
  //check2 search service
  //check3 search resourch and service
  calculateCase(){
    if(this.props.data.test.length != 0){

      this.props.data.test.map((d) => {
        if(this.props.singleResource===d.resourceName){
          check=1
        }
      })
      this.props.services.services.map((d) => {
        if(this.props.singleService===d.service){
          check=2 
        }
        this.props.data.test.map((a) => {
          if(this.props.singleService===d.service&&this.props.singleResource===a.resourceName){
            check=3
          }
        })
      })
    }else{
      check = 0;
    }
  }

  //Send data to insert html tag and push in allItemRows
  pushDataToAllItemRows(){
    //console.log("LOGD: check => "+ check + " " + this.props.data)
    let allItemRows = []
    if(check===0){ //show all item 
      let idx = 0
      this.state.rows.forEach(item => {
        const perItemRows = this.renderItem(item,idx);
        allItemRows = allItemRows.concat(perItemRows);
        idx++;
      });

    }
    
    /*else if(check===1){
      var show = []
      show = this.prepairDataSearchResource()
      show.forEach(item => {
        const perItemRows = this.renderItem(item,0)
        allItemRows = allItemRows.concat(perItemRows)
      })
    }else if(check===2){
      var show = []
      show = this.prepairDataSearchService()
      show.forEach(item => {
        const perItemRows = this.renderItem(item,0)
        allItemRows = allItemRows.concat(perItemRows)
      })
    }else{
      var show = []
      show = this.prepairDataSearchBoth()
      show.forEach(item => {
        const perItemRows = this.renderItem(item,0)
        allItemRows = allItemRows.concat(perItemRows)
      })
    }*/
    return allItemRows
  }

  //------------------------------------render UI iam-------------------------------------------
  // ---------------------------------------------------------------------------------------
  CustomizedTable() {
    const { classes } = this.props;
    check=0
    var stylesRender = this.checkResolution()
    this.calculateCase()
    let allItemRows = this.pushDataToAllItemRows();
    //let allItemRows
    if(check===0){
      //console.log(this.props.data.test)
      if(this.props.data.test.length > 0){
        return (
            <Paper className={stylesRender}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{zIndex:2}} className={classes.headTableTime,classes.flexContainer,classes.tableTimeStyle}>Time</TableCell>
                    {this.props.data.test.map((d) =>
                        <TableCell key={d.resourceId} className={classes.headTable}>{d.resourceName}</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allItemRows}
                </TableBody>
              </Table>
            </Paper>
        )
      }else{
        /*return (
          <Paper className={stylesRender}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell style={{zIndex:2}} className={classes.headTableTime,classes.flexContainer,classes.tableTimeStyle}>Time</TableCell>
                  <TableCell key={0} className={classes.headTable}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allItemRows}
              </TableBody>
            </Table>
          </Paper>
        )*/
      }
    }if(check===2){
      /*return(
          <Paper className={stylesRender}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell style={{zIndex:2}} className={classes.headTableTime,classes.flexContainer,classes.tableTimeStyle}>Time</TableCell>
                  {this.SearchHeaderService()}
                </TableRow>
              </TableHead>
              <TableBody>
                {allItemRows}
              </TableBody>
            </Table>
          </Paper>
      )*/
    }else if(check===3) {
      /*return (
          <Paper className={stylesRender}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell style={{zIndex:2}} className={classes.headTableTime,classes.flexContainer,classes.tableTimeStyle}>Time</TableCell>
                  {this.functionCheckHeader()}
                  <TableCell className={classes.headTable}></TableCell>
                  <TableCell className={classes.headTable}></TableCell>
                  <TableCell className={classes.headTable}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allItemRows}
              </TableBody>
            </Table>
          </Paper>
      )*/
    }else {
      /*return (
          <Paper className={stylesRender}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell style={{zIndex:2}} className={classes.headTableTime,classes.flexContainer,classes.tableTimeStyle}>Time</TableCell>
                  <TableCell className={classes.headTable}>{this.props.singleResource}</TableCell>
                  <TableCell className={classes.headTable}></TableCell>
                  <TableCell className={classes.headTable}></TableCell>
                  <TableCell className={classes.headTable}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allItemRows}
              </TableBody>
            </Table>
          </Paper>
      )*/
    }
  }

  //Render method in React.Component
  render(){

      this.createData()

      return(
          <div>{this.CustomizedTable()}</div>
      )
  }
}

table.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(table)
