const { ApolloServer } = require('apollo-server-lambda');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

/**
 * GraphQL handler logic using apollo-server-lambda
 * For doc please see:
 * https://www.apollographql.com/docs/apollo-server/deployment/lambda.html#Deploying-with-the-Serverless-Framework
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
