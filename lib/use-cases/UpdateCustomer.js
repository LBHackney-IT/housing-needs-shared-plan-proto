module.exports = (options, useCases) => {
  return async (customerId, data) => {
    return await options.dbGateway.updateCustomer(customerId, data);
  }
}
