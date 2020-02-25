import FetchCustomer from './FetchCustomer';
import UpdateCustomer from './UpdateCustomer';
import { hackneyToken } from '../lib/Cookie';

const AuthHeader = {
  headers: {
    Authorization: `Bearer ${hackneyToken()}`,
    'Content-Type': 'application/json'
  }
};

export {
  AuthHeader,
  FetchCustomer,
  UpdateCustomer
};
