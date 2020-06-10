import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainPage from 'pages/main/page';
import * as serviceWorker from './serviceWorker';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import DetailsPage from 'pages/details/page';
import routing_info from 'config/routing.json';
import ManagePage from'pages/manage/page'


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path={routing_info.main}>
          <MainPage detailsPagePath={routing_info.details} managePagePath={routing_info.manage}/>
        </Route>

        <Route exact path={routing_info.details} render={props => 
          <DetailsPage {...props} mainPagePath={routing_info.main}/>}/>

        <Route exact path={routing_info.manage}>
          <ManagePage mainPagePath={routing_info.main}/>
        </Route>
        
        <Redirect to={routing_info.main}></Redirect>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
