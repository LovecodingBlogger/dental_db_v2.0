import 'react-app-polyfill/ie11';
import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import 'core-js/fn/number/is-nan';
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Home from './Home'
import registerServiceWorker from './registerServiceWorker'

const AppWithRouter = () => (
    <Home /> 
) 

ReactDOM.render(<AppWithRouter />, document.getElementById('root'))

export default () => (
    window.location.reload()
)

registerServiceWorker()
