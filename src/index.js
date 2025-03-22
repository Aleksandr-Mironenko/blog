import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { thunk as reduxThunk } from 'redux-thunk'
// import { routerMiddleware } from 'react-router-redux'

// import history from './components/history'
import delayMiddleware from './components/delayMiddleware'
import loadingMiddleware from './components/loadingMiddleware'
import reducer from './redux/reducer'
import App from './components/App'
import history from './components/history'

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose
const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(reduxThunk, delayMiddleware, loadingMiddleware(history)))
)
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
