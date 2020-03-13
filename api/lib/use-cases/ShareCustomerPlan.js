const {generateRandomString} = require('../Utils');

module.exports = (options, useCases) => {
  return async (customerId, details, auth) => {
    const customer = await options.dbGateway.getCustomer(customerId);
    const keys = customer.keys || {};
    const newKey = generateRandomString(10);
    keys[newKey] = {action: "customerPlan", created: (new Date()).toISOString()}
    await options.dbGateway.updateCustomer(customerId, {keys});
    const message = `You can view your plan here: ${process.env.SHARED_PLAN_URL}/customers/${customerId}/plan/view#token=${newKey}`
    console.log(await options.smsGateway.sendMessage(details.name, details.number, message, auth))
  }
}
