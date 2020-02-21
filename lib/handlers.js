'use strict';

module.exports = (useCases) => {

  const send = (data) => {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  }

  const catchError = (fn) => {
    return (async (event) => {
      try {
        return await fn(event)
      } catch (err) {
        if(err.message === 'NotFoundError'){
          return { statusCode: 404 };
        }else if(err.message === 'Unauthorized'){
            return { statusCode: 401 };
        }else if(err.message === 'UserInputError'){
            return { statusCode: 400 };
        }else{
          console.log(err);
          return { statusCode: 500 }
        }
      }
    })
  }


  return {
    getCustomer: catchError(async (event) => {
      const customer = await useCases.getCustomer(event.pathParameters.customerId)
      return send(customer);
    }),

    updateCustomer: catchError(async (event) => {
      await useCases.updateCustomer(event.pathParameters.customerId, JSON.parse(event.body))
      return { statusCode: 204 };
    }),

    authorizer: async (event) => {
      const result = await useCases.authorize(event);
      if(result === 'Unauthorized') throw 'Unauthorized';
      return result;
    }
  }
}
