const request = require('request-promise');

module.exports = (config) => {
  const SMS = {
    sendMessage: async (name, number, message, auth) => {
      return request.post(`${process.env.SMS_API_URL}/messages`, {
        headers: {
          Authorization: auth,
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          name,
          number,
          message
        })
      })
    }
  };
  return SMS;
};
