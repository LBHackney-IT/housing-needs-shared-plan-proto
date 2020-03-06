import { AuthHeader } from '.';

export default (id, details) =>  {
  return fetch(
    `${process.env.REACT_APP_SHARED_PLAN_API_URL}/customers/${id}/share_plan`,
    {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      ...AuthHeader(),
      body: JSON.stringify(details)
    }
  ).then(function(response) {
    if(response.status === 204){
      return true
    }else{
      throw new Error("NotFoundError")
    }
  });
}