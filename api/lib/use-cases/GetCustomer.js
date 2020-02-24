module.exports = (options, useCases) => {
  return async (customerId) => {
    return (await options.dbGateway.getCustomer(customerId));
  }
}
