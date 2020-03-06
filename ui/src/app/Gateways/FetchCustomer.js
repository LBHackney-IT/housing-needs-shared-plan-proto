import { AuthHeader } from '.';

export default (id) =>  {
  return fetch(
    `${process.env.REACT_APP_SHARED_PLAN_API_URL}/customers/${id}`,
    AuthHeader()
  ).then(function(response) {
    if(response.status === 200){
      return response.json();
    }else if(response.status === 401){
      throw new Error("UnauthorizedError")
    }else{
      throw new Error("NotFoundError")
    }
  });
}
