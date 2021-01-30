const accountsResolvers = require("./accounts");
const usersResolvers = require("./users");
const opportunityResolvers = require("./opportunities");

module.exports = {
  Query: {
    ...accountsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...accountsResolvers.Mutation,
    ...opportunityResolvers.Mutation,
  },
};
