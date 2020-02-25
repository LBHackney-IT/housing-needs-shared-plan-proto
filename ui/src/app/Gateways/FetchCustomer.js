import { AuthHeader } from '.';

export default (id) =>  {
  return fetch(
    `${process.env.REACT_APP_SHARED_PLAN_API_URL}/customers/${id}`,
    AuthHeader
  ).then(function(response) {
    if(response.status === 200){
      return response.json();
    }else{
      throw new Error("NotFoundError")
    }
  });
}
