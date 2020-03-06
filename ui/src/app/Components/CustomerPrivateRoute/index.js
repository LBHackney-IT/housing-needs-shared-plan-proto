import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLoggedInCustomer } from '../../lib/Cookie';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedInCustomer() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default PrivateRoute;
