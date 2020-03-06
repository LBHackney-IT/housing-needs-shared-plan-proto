function initUseCases(options) {
  const UseCases = {}
  UseCases.getCustomer = require('./GetCustomer')(options, UseCases);
  UseCases.updateCustomer = require('./UpdateCustomer')(options, UseCases);
  UseCases.authorize = require('./Authorize')(options, UseCases);
  UseCases.shareCustomerPlan = require('./ShareCustomerPlan')(options, UseCases);
  return UseCases;
}

module.exports = initUseCases;
