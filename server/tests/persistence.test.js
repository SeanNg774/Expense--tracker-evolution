const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = require("../app");
const connectDatabase = require("../config/database");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

describe("Database and Data Persistence Integration", () => {
  let token;
  let user;
  let transactionId;

  beforeAll(async () => {
    require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

    const sourceUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
    if (!sourceUri) {
      throw new Error("MONGO_URI or MONGO_URI_TEST is required");
    }

    const testUri = new URL(sourceUri);
    testUri.pathname = "/expense-tracker-jest";
    process.env.MONGO_URI = testUri.toString();
    process.env.JWT_SECRET = "jest-test-secret";
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
    }
    await mongoose.disconnect();
  });

  test("Backend server startup: health endpoint responds successfully", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("MongoDB connection: connects to the isolated test database", async () => {
    await connectDatabase();

    expect(mongoose.connection.readyState).toBe(1);

    user = await User.create({
      username: "persistence-tester",
      email: "persistence@example.com",
      password: "test123",
    });
    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  });

  test("REST API creation: creates and stores an authenticated transaction", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Jest Persistence Test",
        amount: 125.5,
        income: false,
        category: "Bills",
        date: "2026-06-21",
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Jest Persistence Test",
      amount: 125.5,
      income: false,
      category: "Bills",
    });
    expect(response.body.id).toBeDefined();

    transactionId = response.body.id;

    const storedTransaction = await Transaction.findById(transactionId);
    expect(storedTransaction).not.toBeNull();
    expect(storedTransaction.user.toString()).toBe(user.id);
  });

  test("MongoDB retrieval: returns the stored transaction through the API", async () => {
    const response = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: transactionId,
      title: "Jest Persistence Test",
      amount: 125.5,
      income: false,
      category: "Bills",
    });
  });

  test("Transaction deletion: removes the transaction from MongoDB", async () => {
    const deleteResponse = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.id).toBe(transactionId);

    const storedTransaction = await Transaction.findById(transactionId);
    expect(storedTransaction).toBeNull();

    const getResponse = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${token}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual([]);
  });
});
