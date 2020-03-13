'use strict';
const dbConfig = require('./lib/DynamoDbConfig')(process.env);
const dbConn = require('./lib/DynamoDbConnection')(dbConfig);
const dbGateway = require('./lib/gateways/Dynamo')(dbConn);
const smsGateway = require('./lib/gateways/SMS')(dbConn);
const useCases = require('./lib/use-cases')({ dbGateway, smsGateway, jwtsecret: process.env.jwtsecret });
const handlers = require('./lib/handlers')(useCases);

module.exports = handlers;