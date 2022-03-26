# Serverless GraphQL on AWS Lambda

`serverless` 2 || 3

Stands up an AWS Lambda that acts as a GraphQL endpoint.

## Initial setup

`> npm install` 

to download dependencies locally

## Deploying

`> serverless deploy`

:warning: Requires [Serverless Framework](https://www.serverless.com/framework/docs/getting-started)  
:warning: Requires the [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) and an AWS account.

uses `.aws/credentials` profile of `personal-dev` (specified in serverless.yml:provider:profile)

:information_source: After a full deploy, you can use `> npm run deploy-gql` for faster deploy of changes.


# Structure

`gql.js` :arrow_forward: entry point  
`utils.js` :arrow_forward: utility belt

## /g

:open_file_folder: Files for our `GraphQL` implementation.

### entities

Entities define the `objects` or `types` that our endpoint knows how to work with.

Every file in this folder is aggregated to build the total schema definition for our endpoint.

`utils.gql.readSchema` [(here)](https://github.com/readonlychild/starter-lambda-graphql/blob/master/utils.js#L74) takes care of the aggregation.

:page_facing_up: `_Query.gql` :arrow_forward: holds `queries` supported by our endpoint.

```graphql
type Query {
  pokemon(id: String!): Pokemon
  allPokemon(page: Int, itemsPerPage: Int): PokemonPage
  test(message: String!): TestObject
  testNoParam: TestObject
}
```

I create two sample queries:

- `test(message: String!): TestObject`
  - This query requires a `message` parameter, and the query response will be of `type TestObject`.
  - `TestObject` is defined in file `test.gql`.
- `testNoParam: TestObject`
  - This query does not require any parameters. This query also returns a `TestObject`

:page_facing_up: `TestObject.gql` defines one `type`, with all-scalar types: [Scalar-types](https://graphql.org/learn/schema/#scalar-types)

```graphql
type TestObject {
  total: Int!
  caption: String!
  prop1: String!
  prop2: String!
  prop3: String!
}
```

I created better sample queries:

- `pokemon(id: String!): Pokemon`
  - Returns pokemon information for the specified `id`.
- `allPokemon(page: Int, itemsPerPage: Int): PokemonPage`
  - Returns pokemon and shows a `paging` approach.

:page_facing_up: `Types` for these queries can be found in [Pokemon.gql](./g/entities/Pokemon.gql) and [Paging.gql](./g/entities/Paging.gql)

Here is `Paging.gql`
```graphql
type Paging {
  total: Int!
  page: Int!
  totalPages: Int!
  itemsPerPage: Int!
}
```

:page_facing_up: `_Mutation.gql` :arrow_forward: holds `mutations` supported by our endpoint.

Mutations are like queries, but are classified here because they "mutate" data, as opposed to queries where they only access/read data.

This is only convention and nothing prevents you from updating data from a query... maybe like updating a `last_accessed` field.

Same for mutations, if nothing is actually updated, there is no gql-police :police_car:.

```graphql
type Mutation {
    test(message: String!): CanResponse
}

type CanResponse {
  success: Boolean!
  message: String!
  status: String
  warning: String
}
```
There is one sample mutation:

- `test(message: String!): CanResponse`
  - Requires one string parameter and returns a `CanResponse` object, defined in the same file.

:information_source: Because every file in the `entities` folder is merged together, you are free to create one file per type, or group related types into a file...

### resolvers

Resolvers are your logic. Here you can `import` whatever necessary, even other resolvers.

:open_file_folder: Query

For every `query` you define in :page_facing_up: `_Query.gql` you need to define its respective `resolver` and put it in this folder. This is a `.js` file with the query name.

:open_file_folder: Mutation

For every `mutation` you define in :page_facing_up: `_Mutation.gql` you need to define its respective `resolver` and put it in this folder. This is a `.js` file with the mutation name.

I have some resolver templates in `/g/resolvers/`:

- :page_facing_up: `_empty_resolver_sample.js`
- :page_facing_up: `_empty_resolver_sync.js`
- :page_facing_up: `_empty_resolver_promise.js`

Crux:

```javascript
// import things here

var resolver = (obj, args, ctx, info) => {
  /* return object or promise */
  // access query arguments/parameters
  let myParam = args.myParam;
  let msg = myParam;
  return {
    success: true,
    message: msg
  };
  // or
  return new Promise ((resolve, reject) => {
    resolve({
      success: true,
      message: msg
    });
  })
  .catch((err) => {
    //reject(err);
    // or
    resolve({
      success: false,
      message: err.message
    });
  });
};

module.exports = resolver;
```

This shows some possibilities, note the `// or ` where things are "reiterated"; alternatives are given.

# Learn more

[graphql.org/learn](https://graphql.org/learn/)


# Simplest Explanation

The lambda function receives graphql queries (& mutations) and each has a designated resolver, which needs to return/resolve an object with the properties defined by the query/mutation response type.


# Using the Endpoint from JAM

```javascript
axios.post(MY_ENDPOINT, {
  query: 'query { testNoParam { caption total } }'
})
.then((results) => {
  console.log(results.data);
});
```
Logs:

```javascript
{
  "data": {
    "testNoParam": {
      "caption": "Hello user :)",
      "total": 4
    }
  }
}
```

The query 

```graphql
query { testNoParam { caption total } }
```

means execute query testNoParam and get back fields caption & total.

The result of `testNoParam` is wrapped within a parent object `data`.

## Paradigm shift

Normally, in a non-GraphQL API, it would take a call for each query execution. GraphQL enables bundling multiple actions for the API to work on...

```graphql
query { 
  testNoParam { caption } 
  test(message:"Two queries!") { caption }
}
```
returns
```javascript
{
  "data": {
    "testNoParam": {
      "caption": "Hello user :)"
    },
    "test": {
      "caption": "Two queries!"
    }
  }
}
```

![ChromeiQL-1](https://cdn.discordapp.com/attachments/943991815084847175/947983186397388830/unknown.png)


## Dev & Test

There is a [Chrome](https://chrome.google.com/webstore/detail/altair-graphql-client/flnheeellpciglgpaodhkhmapeljopja) and [Edge](https://microsoftedge.microsoft.com/addons/detail/altair-graphql-client/kpggioiimijgcalmnfnalgglgooonopa) browser extension that lets you interact with your lambda graphql easily, it is called **Altair**.

And it also exists for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/altair-graphql-client/).


# Demo

Now that you have your GraphQL browser extension ready, here is the endpoint URL to see it in action!

`https://rj07ty7re4.execute-api.us-east-1.amazonaws.com/dev/gql`

And here are some demo queries to try out:

Grab the second page of available pokemon

```graphql
{
  allPokemon(page:2) {
    items {
      name type1 type2 id stats { attack defense stamina }
    } 
    paging { total page itemsPerPage totalPages }
  }
}
```

Get some details about `ivysaur`

```graphql
{
  pokemon(id:"ivysaur") {
    name type1 type2 names
    stats { attack defense stamina }
    family parentId
    moves { quick eliteQuick charge eliteCharge }
    evolutionBranch { evolution candyCost form }
  }
}
```

Now a request to get details for 3 pokemon, using the same request (as opposed to needing 3 separate requests on a typical REST API)

```graphql
{
  poke1: pokemon(id:"ivysaur") {
    name type1 type2 names
    stats { attack defense stamina }
    moves { quick eliteQuick charge eliteCharge }
  }
  poke2: pokemon(id:"omanyte") {
    name type1 type2 names
    stats { attack defense stamina }
    moves { quick eliteQuick charge eliteCharge }
  }
  poke3: pokemon(id:"gastly") {
    name type1 type2 names
    stats { attack defense stamina }
    moves { quick eliteQuick charge eliteCharge }
  }
}
```
Notice how we `named` each query so the resulting `data` object can hold them as siblings, and we can access them in our code using those `keys`.



# Other

## config.json

A :page_facing_up: JSON file where you can manage environment variables or other things.

There is an example of grabbing an `ES_DOMAIN` value from `config.json` and applying it to the environment of the `gql` lambda function in `serverless.yml`

```
21:  ES_DOMAIN: ${file(./config.json):ES_DOMAIN}
```

## dependencies

`axios` :arrow_forward: for travelling over http[s] to get things.  
`graphql` :arrow_forward: GraphQL magic.  
`@graphql-tools/schema` :arrow_forward: allows GraphQL Schema Language support.  
`nanoid` :arrow_forward: for when you need unique ids.  
`base-64` :arrow_forward: for when you want to send a lot of data and you don't care to create a "complex" type tree.
