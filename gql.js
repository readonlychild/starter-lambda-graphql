'use strict';

const { graphql } = require('graphql');
const utils = require('./utils');
const { makeExecutableSchema } = require('@graphql-tools/schema');

let sdl = false;
let schema = false;
let execSchema = false;
let resolvers = false;

module.exports.gql = (event, context, callback) => {

  console.log(event);
  let evtdata = JSON.parse(event.body);
  let query = '{ testNoParam { total caption } }';
  if (evtdata.query) query = evtdata.query;
  
  sdl = sdl || utils.gql.readSchema('./g/entities');
  resolvers = resolvers || utils.gql.readResolvers('./g/resolvers');
  schema = sdl;
  execSchema = execSchema || makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers
  });

  let variables = evtdata.variables;

  let root = {};
  try {
    root.sourceIp = event.requestContext.identity.sourceIp;
  } catch (err) {}

  root.queryStringParameters = event.queryStringParameters || false;

  if (typeof variables === 'string' && variables.trim().length > 0) {
    variables = JSON.parse(variables);
  }

  var ctx = {};

  graphql(execSchema, query, root, ctx, variables).then((result) => {
    // console.log('graphql result>', result);
    callback(null, utils.apiResponse(JSON.stringify(result)));
  })
  .catch((err) => {
    utils.flipTable(true);
    console.log(JSON.stringify(err));
    callback(utils.apiResponse(JSON.stringify(err)));
  });

};
