import React, { Component } from 'react';
import Header from './Components/Header';
import Phase from './Components/Phase';
import PrivateRoute from './Components/PrivateRoute';
import CustomerPrivateRoute from './Components/CustomerPrivateRoute';
import PlanPage from './Pages/PlanPage';
import SharePlanPage from './Pages/SharePlanPage';
import CustomerPlanPage from './Pages/CustomerPlanPage';
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
            <PrivateRoute path="/customers/:id/plan/share" exact component={SharePlanPage} />
            <CustomerPrivateRoute path="/customers/:id/plan/view" exact component={CustomerPlanPage} />
            <PrivateRoute path="/customers/:id/plan" exact component={PlanPage} />
            <PrivateRoute path="/customers/:id" exact component={VulnsPage} />
          </Router>
        </main>
      </>
    );
  }
}
