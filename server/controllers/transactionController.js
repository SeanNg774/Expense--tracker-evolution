const mongoose = require("mongoose");

const Transaction = require("../models/Transaction");

const sendServerError = (res) => {
  return res.status(500).json({ message: "Internal server error" });
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });

    return res.status(200).json(transactions);
  } catch (error) {
    console.error(`Unable to retrieve transactions: ${error.message}`);
    return sendServerError(res);
  }
};

const createTransaction = async (req, res) => {
  const { title, amount, income, category, date } = req.body || {};
  const normalizedTitle = typeof title === "string" ? title.trim() : "";

  if (!normalizedTitle) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  if (typeof income !== "boolean") {
    return res.status(400).json({ message: "Income must be a boolean" });
  }

  const allowedCategories = [
    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Salary",
    "Other",
  ];

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ message: "A valid category is required" });
  }

  const transactionDate = new Date(date);
  if (!date || Number.isNaN(transactionDate.getTime())) {
    return res.status(400).json({ message: "A valid date is required" });
  }

  try {
    const transaction = await Transaction.create({
      title: normalizedTitle,
      amount,
      income,
      category,
      date: transactionDate,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    console.error(`Unable to create transaction: ${error.message}`);
    return sendServerError(res);
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }

  try {
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error(`Unable to delete transaction: ${error.message}`);
    return sendServerError(res);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
};
