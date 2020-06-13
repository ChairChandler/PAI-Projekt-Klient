import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainPage from 'pages/main/page';
import * as serviceWorker from './serviceWorker';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import DetailsPage from 'pages/details/page';
import ManagePage from 'pages/manage/page'
import TouchPage from 'pages/touch/page';
import routing_info from 'config/routing.json';
import isServerAvailable from 'utils/server-status'

const root = document.getElementById('root')

isServerAvailable()
  .then(async () => {
    if (!await isServerAvailable()) {
      ReactDOM.render(<h1>Server not available</h1>, root)
    } else {
      renderPage()
    }
  })
  .then(() => {
    let loadPage = true, server_unavailable = false
    setInterval(async () => {
      if (!await isServerAvailable()) {
        server_unavailable = true
        ReactDOM.render(<h1>Server not available</h1>, root)
      } else if(server_unavailable) {
        server_unavailable = false
        renderPage()
      }
    }, 5000)
  })

function renderPage() {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route exact path={routing_info.main}>
            <MainPage />
          </Route>

          <Route exact path={routing_info.details} render={props =>
            <DetailsPage {...props} />
          } />

          <Route exact path={routing_info.manage}>
            <ManagePage />
          </Route>

          <Route exact path={routing_info.touch} render={props =>
            <TouchPage {...props} />
          } />

          <Redirect to={routing_info.main}></Redirect>
        </Switch>
      </BrowserRouter>
    </React.StrictMode>,
    root
  )
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
