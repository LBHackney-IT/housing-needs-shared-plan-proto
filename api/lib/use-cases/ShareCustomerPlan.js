const {generateRandomString} = require('../Utils');

module.exports = (options, useCases) => {
  return async (customerId, details, auth) => {
    const customer = await options.dbGateway.getCustomer(customerId);
    const keys = customer.keys || {};
    const newKey = generateRandomString(10);
    keys[newKey] = {action: "customerPlan", created: (new Date()).toISOString()}
    await options.dbGateway.updateCustomer(customerId, {keys});
    const message = `You’ve been sent a link to your Shared Plan from Hackney Council. Click here to view: ${process.env.SHARED_PLAN_URL}/customers/${customerId}/plan/view#token=${newKey}`
    console.log(await options.smsGateway.sendMessage(details.name, details.number, message, auth))
  }
}
