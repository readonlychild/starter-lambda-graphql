# Serverless GraphQL on AWS Lambda

`serverless` 2 || 3

Stands up a lambda that acts as a GraphQL endpoint.

## Initial setup

`> npm install` 

to download dependencies locally

## Structure

`gql.js` :arrow_forward: entry point  
`utils.js` :arrow_forward: utility belt

### /g

Files for our `GraphQL` implementation.

#### entities

Entities define the `objects or types` that our endpoint knows how to work with.

Every file in this folder is appended to build the total schema for our endpoint.

`utils.gql.readSchema` takes care of this.

:page_facing_up: `_Query.gql` :arrow_forward: holds `queries` supported by our endpoint.

```graphql
type Query {
  test(message: String!): TestObject
  testNoParam: TestObject
}
```

I create two sample queries:

- `test(message: String!): TestObject`
  - This query requires a `message` parameter, and the query response will be of `type TestObject`.
  - `TestObject` is define in file `test.gql`.
- `testNoParam: TestObject`
  - This query does not require any parameters. This query also returns a `TestObject`


:page_facing_up: `test.gql` defines one `type`, with all-scalar types: [Scalar-types](https://graphql.org/learn/schema/#scalar-types)

```
type TestObject {
  total: Int!
  caption: String!
  prop1: String!
  prop2: String!
  prop3: String!
}
```

:page_facing_up: `_Mutation.gql` :arrow_forward: hold `mutations` supported by our endpoint.

Mutations are like queries, but are classified here because they "mutate" data, as opposed to queries where they only access/read data.

This is only convention and nothing prevents you from updating data from a query... maybe like updating a `last_accessed` field.

Same for mutations, if nothing is actually updated, there is no gql-police.

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
  - Requires one string parameter and returns a `CanReponse` object, defined in the same file.

:information_source: Because every file in the `entities` folder is mergeds together, you are free to create one file per type, or group related types into a file...

#### resolvers

Resolvers are your logic. Her you can `import` whatever necessary, even other resolvers.

:open_file_folder: Query

For every `query` you define in :page_facing_up: `_Query.gql` you need to define its respective `resolver`. This is a `.js` file with the query name.

:open_file_folder: Mutation

For every `mutation` you define in :page_facing_up: `_Mutation.gql` you need to define its respective `resolver`. This is a `.js` file with the mutation name.

I have created a resolver template on :page_facing_up: `g/resolvers/_mpty_resolver.js`

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

## Learn more

[graphql.org/learn](https://graphql.org/learn/)

## Deploying

`> serverless deploy`

uses `.aws/credentials` profile of `personal-dev` (specified in serverless.yml:provider:profile)

## Other

### config.json

a JSON where you can manage environment variables or other things.

There is an example of grabbibg the `ES_DOMAIN` value from `config.json` and applying it to the `gql` lambda function in `serverless.yml`

```
21:  ES_DOMAIN: ${file(./config.json):ES_DOMAIN}
```

### dependencies

`axios` :arrow_forward: for travelling the http[s] to get things.  
`graphql` :arrow_forward: GraphQL magic.  
`@graphql-tools/schema` :arrow_forward: allows GraphQL Schema Language support.
`nanoid` :arrow_forward: for when you need unique ids.
`base-64` :arrow_forward: for when you want to send a lot of data and you don't care to create a "complex" type tree.
