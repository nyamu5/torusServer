const { model, Schema } = require("mongoose");

const accountSchema = new Schema({
  name: String,
  address: String,
  username: String,
  createdAt: String,
  opportunities: [
    {
      name: String,
      amount: Number,
      stage: String,
      discovery: String,
      proposal: String,
      negotiations: String,
      username: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = model("Account", accountSchema);
