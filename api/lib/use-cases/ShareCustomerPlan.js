const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtsecret;

const generateApiKey = (customerId) => {
  return jwt.sign({ path: `/customers/${customerId}`, methods: ['get'] }, jwtSecret);
}

module.exports = (options, useCases) => {
  return async (customerId, details) => {
    const message = `You can view your plan here: http://localdev.hackney.gov.uk:3001/customers/${customerId}/plan/view#token=${generateApiKey(customerId)}`
    console.log(message)
    
    return true
  }
}
