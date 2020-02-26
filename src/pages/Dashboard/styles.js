
const styles = theme => ({
    root: {
      width: 'auto',
      height: 200,
      flexGrow: 1,      
      marginTop: theme.spacing.unit * 3,
      overflow: 'auto',
      borderWidth: '2px',
      borderTopStyle:'solid',
      borderColor:'#ddd',  
    },
    headTable: {
      backgroundColor:"#fff",
      position: 'sticky',
      top: 0,
    },  
    tableCell:{
      backgroundColor:"#fff",
      position: 'sticky',    
      left: 3
    },
    
    table: {
      minWidth: 700,
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
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
  });
