const { AuthenticationError, UserInputError } = require("apollo-server");
const Account = require("../../models/Account");

const Account = require("../../models/Account");
const checkAuth = require("../../utilities/check-auth");

module.exports = {
  Query: {
    async getAccounts() {
      try {
        const accounts = await Account.find().sort({ createdAt: -1 });
        return accounts;
      } catch (e) {
        throw new Error(e);
      }
    },
    async getAccount(_, { accountId }) {
      try {
        const account = await Account.findById(accountId);
        if (account) {
          return account;
        } else {
          throw new Error("Account not found");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Mutation: {
    async createAccount(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Account body must not be empty");
      }

      const newAccount = new Account({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const account = await newAccount.save();

      return account;
    },
    async deleteAccount(_, { accountId }, context) {
      const user = checkAuth(context);
      try {
        const account = await Account.findById(accountId);
        if (user.username === account.username) {
          await account.delete();
          return "Account successfully deleted";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};
