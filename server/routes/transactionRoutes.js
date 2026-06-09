const express = require("express");

const {
  getTransactions,
  createTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/", getTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
