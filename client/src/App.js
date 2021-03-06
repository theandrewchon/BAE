import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './pages/Landing/index';
import NoMatch from './pages/NoMatch';
import User from './pages/User/index';
import Meeting from './pages/Meeting/Meeting';
import SignUp from './pages/SignUp';
import NewMeeting from './pages/NewMeeting';
import Login from './pages/Login';
import Survey from './pages/Survey';
import './styles/app.css';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Landing}>
            {/* <Landing /> */}
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/user">
            <User />
          </Route>
          <Route path="/newmeeting">
            <NewMeeting />
          </Route>
          <Route path="/meeting">
            <Meeting />
          </Route>
          <Route path="/survey">
            <Survey />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
