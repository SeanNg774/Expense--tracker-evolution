const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      validate: {
        validator: (value) => Number.isFinite(value) && value > 0,
        message: "Amount must be greater than 0",
      },
    },
    income: {
      type: Boolean,
      required: [true, "Income is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    },
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
