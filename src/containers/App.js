import React from 'react';
import {Route, Switch} from 'react-router-dom';
import HomePage from "../pages/HomePage";
import LoginPage from '../pages/LoginPage';
import UserSignupPage from '../pages/UserSignupPage';
import UserPage from '../pages/UserPage';
import * as apiCalls from '../api/apiCalls';
import TopBar from '../components/TopBar';

const actions ={
  postLogin: apiCalls.login,
  postSignup: apiCalls.signup
}
function App() {
  return (
    <div>
      <TopBar/>
        <div className="container">

          <Switch>
            <Route path="/" component={HomePage} exact/>
            <Route path="/login" component={(props)=> <LoginPage actions={actions} {...props}/>}/>
            <Route path="/signup" component={(props)=> <UserSignupPage actions={actions} {...props}/>}/>
            <Route path="/:username" component={UserPage}/>         
          </Switch>

        </div>
    </div>

  );
}

export default App;
