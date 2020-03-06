const jwt = require('jsonwebtoken');

module.exports = (options, useCases) => {
  const jwt_secret = options.jwtsecret;

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

  const requestAllowed = async (tokenPayload, event) => {
    if( tokenPayload.groups && tokenPayload.groups.indexOf('housingneeds-singleview-beta') >= 0) return true;
    if(tokenPayload.path && tokenPayload.methods){
      if(tokenPayload.path === event.path && tokenPayload.methods.indexOf(event.httpMethod.toLowerCase()) >= 0 ) return true
    }
  }

  return async (event) => {
    const token = extractTokenFromAuthHeader(event);
    const decodedToken = decodeToken(token);
    if (token && decodedToken && (await requestAllowed(decodedToken, event))) {
      return allow(event.methodArn);
    } else {
      return 'Unauthorized';
    }
  };
}
