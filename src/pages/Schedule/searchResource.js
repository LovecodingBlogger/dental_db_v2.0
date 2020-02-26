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
      singleResource: '',
      suggestionsResource: [],  
  
             
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

  renderSuggestionResource(suggestion, { query, isHighlighted }) {   
    const matches = match(suggestion.Name, query);
    const parts = parse(suggestion.Name, matches);
  
    return (      
      <MenuItem selected={isHighlighted} component="div"  >
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

  getSuggestionsResource(value) {                
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;        
    return inputLength == 0
      ? []
      : this.props.resource.resource.filter(suggestion => {        
          const keep = count < 5 && suggestion.Name.slice(0, inputLength).toLowerCase() == inputValue;
          if (keep) {
            count += 1;
          }  
          return keep;
        });
  }

  getSuggestionValueResource(suggestion) {    
    return suggestion.Name;       
  }

  autocompleteResource(){

  if(this.props.resource.resource!=null){                                       
    this.handleSuggestionsFetchRequested = ({ value }) => {                        
      this.setState({
        suggestionsResource: this.getSuggestionsResource(value),
      });
    };  
      
    this.handleSuggestionsClearRequested = () => {                           
      this.setState({
        suggestionsResource: [],
      });
    };        
    this.handleChange = name => (event, { newValue }) => {                            
      this.setState({
        [name]: newValue,
      });
      //Check resource mapping text field insert
      if(this.props.resource.resource!==null){
        this.props.resource.resource.map(d => {
          if(d.Name===newValue&&newValue!==cache){
            this.props.confirm(newValue)
            cache = newValue
          }else if(newValue==""&&newValue!=cache){
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
    suggestions: this.state.suggestionsResource,
    onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: this.handleSuggestionsClearRequested,                
    getSuggestionValue: this.getSuggestionValueResource,
    renderSuggestion: this.renderSuggestionResource,
    };

    return (
      <div className={classes.autocomplete}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            placeholder: 'Search a Resource',
            value: this.state.singleResource,     //insert data for autocomplete
            onChange: this.handleChange('singleResource'),
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper style={{display: 'flex',minWidth:400, maxHeight:200,overflow:'auto'}} {...options.containerProps} square>             
              {options.children}
            </Paper>
          )}
        />
      </div>
    )}
  }
  
  //Render method in React.Component
  render() {
    return (      
      <div >{this.autocompleteResource()}</div>   
    );
  }  
}

test.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default  withStyles(styles)(test)
