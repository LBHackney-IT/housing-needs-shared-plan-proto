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
      data.customerId = customerId;
      await config.client.put({
        TableName: config.tables.customersTable,
        Key: { customerId },
        Item: data
      }).promise();
    }
  };
  return Dynamo;
};
