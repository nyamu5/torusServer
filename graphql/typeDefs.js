const { gql } = require("apollo-server");

module.exports = typeDefs = gql`
  type Account {
    id: ID!
    name: String!
    address: String!
    createdAt: String!
    username: String!
    opportunities: [Opportunity]!
    # commentCount: Int!
  }
  type Opportunity {
    id: ID!
    name: String!
    amount: Number!
    stage: String!
    discovery: String!
    proposal: String!
    negotiations: String!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
  }
  type Query {
    getAccounts: [Account]
    getAccount(accountId: ID!): Account
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createAccount(body: String!): Account!
    deleteAccount(accountId: ID!): String!
    createOpportunity(accountId: ID!, body: String!): Post!
    deleteOpportunity(accountId: ID!, OpportunityId: ID!): Post!
  }
`;
