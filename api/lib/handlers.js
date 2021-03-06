'use strict';

module.exports = (useCases) => {

  const send = (data) => {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
          return { statusCode: 404, headers: { 'Access-Control-Allow-Origin': '*' } };
        }else if(err.message === 'Unauthorized'){
            return { statusCode: 401, headers: { 'Access-Control-Allow-Origin': '*' } };
        }else if(err.message === 'UserInputError'){
            return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' } };
        }else{
          console.log(err);
          return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
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
      return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' } };
    }),

    shareCustomerPlan: catchError(async (event) => {
      const auth = event.headers.Authorization;
      await useCases.shareCustomerPlan(event.pathParameters.customerId, JSON.parse(event.body), auth)
      return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' } };
    }),

    authorizer: async (event) => {
      const result = await useCases.authorize(event);
      if(result === 'Unauthorized') throw 'Unauthorized';
      return result;
    }
  }
}
