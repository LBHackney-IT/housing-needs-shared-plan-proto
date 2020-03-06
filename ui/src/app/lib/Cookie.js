import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

export const isLoggedIn = function() {
  const hackneyToken = Cookies.get('hackneyToken');
  if (!hackneyToken) return false;

  const payload = jwt.decode(hackneyToken);
  return (
    payload &&
    payload.groups &&
    payload.groups.indexOf('housingneeds-singleview-beta') > -1
  );
};

export const isLoggedInCustomer = function() {
  const hash = window.location.hash;
  if( hash && hash.match(/\#token=.*/)){
    const customerToken = hash.replace('#token=', '')
    const payload = jwt.decode(customerToken);
    if(payload.path && payload.methods){
      console.log(payload.path, window.location.pathname)
      if(window.location.pathname.startsWith(payload.path)){
        Cookies.set('hackneyCustomerToken', customerToken);
        return true
      }
    }
  }
};

export const username = function() {
  const hackneyToken = Cookies.get('hackneyToken');
  if (!hackneyToken) return false;
  const decoded = jwt.decode(hackneyToken);
  return decoded ? decoded.name : '';
};

export const hackneyToken = function() {
  return Cookies.get('hackneyToken');
};

export const hackneyCustomerToken = function() {
  return Cookies.get('hackneyCustomerToken');
};
