const express = require("express");
const router = express.Router();

// 1. Import the Controllers
const { 
  getTransactions, 
  createTransaction, 
  deleteTransaction 
} = require("../controllers/transactionController");

// 2. Import the Security Middleware
const { protect } = require("../middleware/authMiddleware");

// 3. Lock down the routes using 'protect'
router.route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);

router.route("/:id")
  .delete(protect, deleteTransaction);

module.exports = router;