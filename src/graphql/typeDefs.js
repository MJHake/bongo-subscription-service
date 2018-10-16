const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type BongoBackend {
    id: String!
    region: String!
    name: String!
    url: String!
  }
  type AccessCode {
    id: String!
    code: String!
    createDate: String!
    expireDate: String!
    seller: Seller!
  }
  type Seller {
    id: String!
    name: String!
    email: String!
    accessCodes: [AccessCode!]!
  }

  type Query {
    backends: [BongoBackend!]!
    sellers: [Seller!]!
    seller(id: String): Seller
  }

  type Mutation {
    createSeller(name: String, email: String): Seller
    registerBackend(name: String, url: String, region: String): BongoBackend
  }
`;

module.exports = typeDefs;
