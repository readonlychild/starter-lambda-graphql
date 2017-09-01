const graphql = require('graphql');

// QUERIES
const basicQuery = {
    name: 'BasicQuery',
    description: 'A Basic Query',
    type: new graphql.GraphQLObjectType({
        name: 'UserType',
        description: '',
        fields: function () {
            return {
                username: { type: graphql.GraphQLString },
                password: { type: graphql.GraphQLString }
            };
        }
    }),
    args: {
        username: { type: graphql.GraphQLString }
    },
    resolve: function (root, args, ctx) {
        // root: parent object, for hierarchy resolves
        // args: supplied by query
        // ctx: passed in from root graphql fx
        return {
            username: args.username,
            password: 'p@$$w0rd'
        };
    }
};

// MUTATIONS 
const basicMutation = {
    name: 'BasicMutation',
    description:'this is a test; no fields, returns a string',
    type: graphql.GraphQLString,
    args: {
        id: { type: graphql.GraphQLString }
    },
    resolve: function (root, args, ast) {
        return 'hello ' + args.id;
    }
};

const schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Queries',
        fields: {
            basic: basicQuery
        }
    }),
    mutation: new graphql.GraphQLObjectType({
        name: 'Mutations',
        fields: {
            basic: basicMutation
        }
    })
});

module.exports = schema;
