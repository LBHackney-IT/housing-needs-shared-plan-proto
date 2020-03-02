import React, { Component } from 'react';
import Header from './Components/Header';
import Phase from './Components/Phase';
import PrivateRoute from './Components/PrivateRoute';
import PlanPage from './Pages/PlanPage';
import VulnsPage from './Pages/VulnsPage';
import LoginPage from './Pages/LoginPage';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './css/styles.scss';
import './App.css';

import { initAll } from 'lbh-frontend';

export default class App extends Component {
  componentDidMount() {
    initAll();
  }

  render() {
    return (
      <>
        <Header />
        <Phase />
        <main className="lbh-main-wrapper" id="main-content">
          <Router>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path="/customers/:id" exact component={VulnsPage} />
            <PrivateRoute path="/customers/:id/plan" component={PlanPage} />
          </Router>
        </main>
      </>
    );
  }
}
