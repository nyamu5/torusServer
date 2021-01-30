const { AuthenticationError, UserInputError } = require("apollo-server");

const Account = require("../../models/Account");
const checkAuth = require("../../utilities/check-auth");

module.exports = {
  Mutation: {
    async createOpportunity(_, { accountId, name, amount, stage }, context) {
      const { username } = checkAuth(context);
      if (name.trim === "") {
        throw new UserInputError("Empty opportunity", {
          errors: {
            name: "opportunity name must not be empty",
          },
        });
      }
      const account = await Account.findById(accountId);

      if (account) {
        account.opportunities.unshift({
          name,
          amount,
          stage,
          username,
          createdAt: new Date().toISOString(),
        });
        await account.save();
        return account;
      } else {
        throw new UserInputError("account not found");
      }
    },

    async deleteOpportunity(_, { accountId, opportunityId }, context) {
      const { username } = checkAuth(context);

      const account = await Account.findById(accountId);

      if (account) {
        const opportunityIndex = account.opportunities.findIndex(
          (c) => c.id === opportunityId
        );

        if (account.opportunities[opportunityIndex].username === username) {
          account.opportunities.splice(opportunityIndex, 1);
          await account.save();
          return account;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("account not found");
      }
    },
  },
};
