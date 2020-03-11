module.exports = (options, useCases) => {
  return async (customerId) => {
    const customer = await options.dbGateway.getCustomer(customerId)
    return {customerId: customer.customerId, plan: customer.plan, vulnerabilities: customer.vulnerabilities};
  }
}
