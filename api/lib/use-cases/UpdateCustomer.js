module.exports = (options, useCases) => {
  return async (customerId, data) => {
    const customer = {};
    if(data.plan) customer.plan = data.plan;
    if(data.vulnerabilities) customer.vulnerabilities = data.vulnerabilities;
    return await options.dbGateway.updateCustomer(customerId, customer);
  }
}
