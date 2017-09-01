'use strict';

require('dotenv').config();

var graphql = require('graphql');
const utils = require('./utils');
var schema  = require('./data/schema.js');

module.exports.gql = (event, context, callback) => {

  var evtdata = JSON.parse(event.body);
  var query = '{ basic { username password } }';
  if (evtdata.query) query = evtdata.query;
  
  var variables = evtdata.variables;

  var root = {};
  try {
    root.sourceIp = event.requestContext.identity.sourceIp;
  } catch (err) {}

  root.queryStringParameters = event.queryStringParameters || false;

  // console.log('evt', event);
  // console.log(evtdata);
  // console.log('qry', query);
  // console.log('vrs', variables);

  if (typeof variables === 'string' && variables.trim().length > 0) {
    variables = JSON.parse(variables);
  }

  var ctx = {};
  ctx.jwt_token = event.headers['jwt_token'] || '';
  /*
  var editMode = false;
  if (event.queryStringParameters && event.queryStringParameters.editMode) {
    editMode = event.queryStringParameters.editMode === 'true';
  };
  ctx.editMode = editMode;
  */

  graphql.graphql(schema, query, root, ctx, variables).then((result) => {
    // console.log('graphql result>', result);
    callback(null, utils.apiResponse(JSON.stringify(result)));
  })
  .catch((err) => {
    utils.flipTable(true);
    console.log(JSON.stringify(err));
    callback(utils.apiResponse(JSON.stringify(err)));
  });

};
