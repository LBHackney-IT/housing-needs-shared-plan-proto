import { AuthHeader } from '.';

export default (id, customer) =>  {
  return fetch(
    `${process.env.REACT_APP_SHARED_PLAN_API_URL}/customers/${id}`,
    {
      method: 'PUT',
      mode: 'cors',
      cache: 'no-cache',
      ...AuthHeader(),
      body: JSON.stringify(customer)
    }
  ).then(function(response) {
    if(response.status === 204){
      return true
    }else{
      throw new Error("NotFoundError")
    }
  });
}