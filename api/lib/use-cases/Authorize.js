require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (options, useCases) => {
  const jwt_secret = options.loginData.jwt_secret;

  const allow = resource => {
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: resource
          }
        ]
      }
    };
  };

  const extractTokenFromAuthHeader = event => {
    if (!(event.headers && event.headers.Authorization)) return null;
    if (event.headers.Authorization.startsWith('Bearer')) {
      return event.headers.Authorization.replace('Bearer ', '');
    }
  }

  const decodeToken = token => {
    try {
      return jwt.verify(token, jwt_secret);
    } catch (err) {
      return false;
    }
  }

  const requestAllowed = async (tokenPayload, event, token) => {
    if(tokenPayload.scope === 'user'){
      return true;
    }else if(tokenPayload.scope === 'group'){
      if(tokenPayload.groupId && event.path.startsWith(`/groups/${tokenPayload.groupId}`)){
        if(
          (tokenPayload.methods.length === 1 && tokenPayload.methods[0] === '*') ||
          tokenPayload.methods.indexOf(event.httpMethod) >= 0
        ){
          const validKeys = await useCases.listGroupKeys(tokenPayload.groupId);
          for(let key of validKeys){
            if(key.token === token) return true;
          }
        }
      }
    }
    return false;
  }

  return async (event) => {
    const token = extractTokenFromAuthHeader(event);
    const decodedToken = decodeToken(token);
    if (token && decodedToken && (await requestAllowed(decodedToken, event, token))) {
      return allow(event.methodArn);
    } else {
      return 'Unauthorized';
    }
  };
}
