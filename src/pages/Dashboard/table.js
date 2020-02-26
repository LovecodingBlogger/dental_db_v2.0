import React, {Component} from 'react'
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Popover, Button } from 'antd';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
  root_1000: {
    width: 'auto',
    height:275,
    flexGrow: 1,      
    marginTop: theme.spacing.unit * 3,
    overflow: 'auto',
    borderWidth: '2px',
    borderTopStyle:'solid',
    borderColor:'#ddd',  
  },
  root_800: {
    width: 'auto',
    height:160,
    flexGrow: 1,      
    marginTop: theme.spacing.unit * 3,
    overflow: 'auto',
    borderWidth: '2px',
    borderTopStyle:'solid',
    borderColor:'#ddd',  
  },
  root_1080: {
    width: 'auto',
    height:385,
    flexGrow: 1,      
    marginTop: theme.spacing.unit * 3,
    overflow: 'auto',
    borderWidth: '2px',
    borderTopStyle:'solid',
    borderColor:'#ddd',  
  },
  
  headTable: {
    color: "#fff",
    backgroundColor:"#990099",
    position: 'sticky',
    top: 0,
    fontSize: "1.1em"
  },  
  tableCell:{
    backgroundColor:"#fff",
    position: 'sticky',    
    left: 3
  },
  tablerow:{
    height : "3px",
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#d9b3ff',
    },
  },
  autocomplete: {
    height: 70,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  gridList: {
    width: 400,
    height: 200,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
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

class table extends Component {

  //Constructor method in React.Component for initial state
  constructor(props){
    super(props)
    this.state = {
      date: new Date(),
      expandedRows:[],
      rows:[],
      careProService:[],
      careProServiceDesc:[]
    };
  }

  componentWillReceiveProps (nextProps){
    
    //console.log(nextProps.resourceService)
    if(nextProps.resourceService.ResourceService !== this.state.careProService && nextProps.resourceService.ResourceService !== undefined){
      this.setState({careProService: nextProps.resourceService.ResourceService});
      console.log('-----------LOGD >> ')
      console.log(nextProps.resourceService.ResourceService)
    }
    /*this.props.resourceService.map((obj) => {
      console.log('---------> '+obj)
    });*/
    /*if(this.props.resourceService!==this.state.careProService.rows){
      //Perform some operation
      this.setState({careProService: this.props.resourceService });
      //this.classMethod();
      console.log(this.state.careProService)
    }*/
    

  }

  //Check resolution of user and return styles
  checkResolution(){
    const { classes } = this.props;
    var resolutionRender = document.documentElement.clientHeight;
    //console.log("LOGD: resolution size " + resolutionRender);
    if(resolutionRender<700){
      return classes.root_800
    }else if(resolutionRender<950){
      return classes.root_1000
    }else if(resolutionRender>960){
      return classes.root_1080
    }
  }
  
  content (id){
    //console.log(id)
    let service = []
    
    for(let i=0; i<this.state.careProService.length; i++){
      if(id == this.state.careProService[i].Code){
        for(let j=0; j<this.state.careProService[i].Services.length; j++){
          //console.log(this.state.careProService[i].Services[j])
          let num = 0
          service.push(
            <GridListTile style={{ height: 'auto' }}>
              <p key={num}>{this.state.careProService[i].Services[j].Service.toString()}</p>
            </GridListTile>
          )
          num++;
        }
      }
      break;
    }
  
    return(
        service     
    )
  }

  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    var stylesRender = this.checkResolution()
    return (
      <Paper className={stylesRender}>
        <Table className={classes.table}>
          <TableHead className={classes.headTable}>
            <TableRow>
              <TableCell className={classes.headTable}>Room</TableCell>
              <TableCell className={classes.headTable}>Resource</TableCell>
              <TableCell className={classes.headTable}>Service</TableCell>
              <TableCell className={classes.headTable}>Start-End Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.rows.map(row => {
                return (
                    <TableRow className={classes.row} key={row.idForTableTotal}>
                      <CustomTableCell  style={{ width: 'auto',border:0 }}>{row.room}</CustomTableCell>
                      <CustomTableCell  style={{ width: 'auto',border:0 }}>{row.resource}</CustomTableCell>
                      {/*<CustomTableCell  style={{ width: 'auto' }}>{row.service}</CustomTableCell>*/}
                      <CustomTableCell  style={{ width: 'auto',border:0 }}>
                      <Popover placement="topLeft" style={{backgroundColor:'red'}} content={
                          <GridList cols={1} className={classes.gridList}>
                            {this.content(row.resource_id)}
                          </GridList>
                        } title={<p style={{color:'white'}}>Services</p>}>
                        <p type="primary" overflow="auto">{row.service}</p>
                      </Popover>
                      </CustomTableCell>
                      <CustomTableCell  style={{ width: 'auto',border:0 }}>{row.time}</CustomTableCell>
                    </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

table.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default  withStyles(styles)(table)
