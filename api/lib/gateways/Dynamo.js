module.exports = (config) => {
  const Dynamo = {
    getCustomer: async (customerId) => {
      const customer = await config.client.get({
        TableName: config.tables.customersTable,
        Key: { customerId }
      }).promise();
      if(!customer.Item) throw new Error('NotFoundError');
      return customer.Item
    },

    updateCustomer: async (customerId, data) => {
      const updateExpressionItems = [];
      const ExpressionAttributeNames = {};
      const ExpressionAttributeValues = {};
      Object.keys(data).forEach(attr => {
        if(attr !== 'customerId'){
          updateExpressionItems.push(`#key${attr} = :val${attr}`);
          ExpressionAttributeNames[`#key${attr}`] = attr;
          ExpressionAttributeValues[`:val${attr}`] = data[attr];
        }
      })

      await config.client.update({
        TableName: config.tables.customersTable,
        Key: { customerId },
        ExpressionAttributeValues,
        ExpressionAttributeNames,
        UpdateExpression: 'SET ' + updateExpressionItems.join(', ')
      }).promise();
    }
  };
  return Dynamo;
};
