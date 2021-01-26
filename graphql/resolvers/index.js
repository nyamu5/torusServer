const accountsResolvers = require("./accounts");
const usersResolvers = require("./users");
const commentResolvers = require("./comments");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,

    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...accountsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...accountsResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
