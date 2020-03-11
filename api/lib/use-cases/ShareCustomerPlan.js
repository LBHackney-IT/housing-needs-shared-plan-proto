const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtsecret;
const {generateRandomString} = require('../Utils');

module.exports = (options, useCases) => {
  return async (customerId, details) => {
    const customer = await options.dbGateway.getCustomer(customerId);
    const keys = customer.keys || {};
    const newKey = generateRandomString(10);
    keys[newKey] = {action: "customerPlan", created: (new Date()).toISOString()}
    await options.dbGateway.updateCustomer(customerId, {keys});
    const message = `You can view your plan here: http://localdev.hackney.gov.uk:3001/customers/${customerId}/plan/view#token=${newKey}`
    console.log(message)
    
    return true
  }
}
