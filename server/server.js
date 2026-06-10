require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");

const connectDatabase = require("./config/database");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const port = process.env.PORT || 5001;

const corsOptions = process.env.CLIENT_ORIGIN
  ? { origin: process.env.CLIENT_ORIGIN }
  : {};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
