import FetchCustomer from './FetchCustomer';
import UpdateCustomer from './UpdateCustomer';
import ShareCustomerPlan from './ShareCustomerPlan';
import { hackneyToken, hackneyCustomerToken } from '../lib/Cookie';

const AuthHeader = () => {
  return {
    headers: {
      Authorization: `Bearer ${hackneyToken() || hackneyCustomerToken()}`,
      'Content-Type': 'application/json'
    }
  }
};

export {
  AuthHeader,
  FetchCustomer,
  UpdateCustomer,
  ShareCustomerPlan
};
