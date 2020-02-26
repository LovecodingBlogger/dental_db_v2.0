import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
//------------------------------Styles------------------------------------//

const styles = theme => ({
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
    overflow:'auto',
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

var cache = "@@@"

class test extends React.Component {
  //Constructor method in React.Component for initial state
  constructor(props){
    super(props)  
    this.state = {
      singleService: '',
      suggestionsService: [],       
    };  
  }

  //-------------------------Auto-Complete-Search-Function-------------------//
  renderInputComponent(inputProps) {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;
    return (
      <TextField 
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input,
          },
        }}
        {...other}
      />
    );
  }

  renderSuggestionService(suggestion, { query, isHighlighted }) {   
    const matches = match(suggestion.service, query);
    const parts = parse(suggestion.service, matches);
  
    return (      
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}> 
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  }
  getSuggestionsService(value) {        
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;        
    return inputLength === 0
      ? []
      : this.props.services.services.filter(suggestion => {        
          const keep = count < 5 && suggestion.service.slice(0, inputLength).toLowerCase() === inputValue;
          if (keep) {
            count += 1;
          }  
          return keep;
        });
  }
  getSuggestionValueService(suggestion) {             
    return suggestion.service;       
  }
  
  autocompleteService(){
    if(this.props.services.services!=null){            
      this.handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestionsService: this.getSuggestionsService(value),
        });
      };        
      this.handleSuggestionsClearRequested = () => {
        this.setState({
          suggestionsService: [],
        });
      };        
      this.handleChange = name => (event, { newValue }) => {
        this.setState({
          [name]: newValue,
        });
        if(this.props.services.services!==null){
          this.props.services.services.map(d => {
            if(d.service===newValue&&newValue!==cache){
              this.props.confirm(newValue)
              cache = newValue         
            }else if(newValue===""&&newValue!==cache){
              this.props.confirm(newValue)
              cache = newValue           
            }
            return null
          }) 
        }  
      };
      const { classes } = this.props;
      const autosuggestProps = {
      renderInputComponent: this.renderInputComponent,
      suggestions: this.state.suggestionsService,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,                
      getSuggestionValue: this.getSuggestionValueService,
      renderSuggestion: this.renderSuggestionService,
      };
      return (
        <div className={classes.autocomplete}>
          <Autosuggest
            {...autosuggestProps}
            inputProps={{
              classes,
              placeholder: 'Search a Service',
              value: this.state.singleService,     //insert data for autocomplete
              onChange: this.handleChange('singleService'),
            }}
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion,
            }}
            renderSuggestionsContainer={options => (
              /*
              <Paper  style={{ minWidth:400,maxWidth:"auto", maxHeight:140,overflow:'auto' }} {...options.containerProps} square>             
                {options.children}
              </Paper>
              */
              <Paper  style={{ display: 'flex',minWidth:400, maxHeight:140,overflow:'auto'}} {...options.containerProps} square>             
                {options.children}
              </Paper>
            )}
          />
        </div>
      )
    }
  }
  
  render() {
    return (      
      <div >{this.autocompleteService()}</div>   
    );
  }  
}

test.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default  withStyles(styles)(test)
