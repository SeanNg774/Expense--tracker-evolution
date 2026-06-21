const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Import your Express app
const User = require("../models/User");

// Run this before any tests start
beforeAll(async () => {
  // Connect to your database (Make sure MONGO_URI is available)
  await mongoose.connect(process.env.MONGO_URI);
});

// Run this after all tests finish
afterAll(async () => {
  // Clean up the test user we are about to create so we can run the test again later
  await User.deleteOne({ email: "testuser@example.com" });
  await mongoose.connection.close();
});

describe("Authentication API Testing", () => {
  
  // 1. Test Successful Registration
  it("Should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token"); // Asserts that a JWT was generated
    expect(res.body.user).toHaveProperty("username", "testuser");
  });

  // 2. Test Duplicate Email Prevention
  it("Should block registration if email already exists", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "anotheruser",
      email: "testuser@example.com", // Same email as above!
      password: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("User already exists");
  });

  // 3. Test Successful Login
  it("Should login an existing user and return a JWT", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  // 4. Test Failed Login
  it("Should reject login with incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword!",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  // 5. Test Empty Fields 
  it("Should reject registration if email is an empty string", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "", // Empty email
      password: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message"); 
  });

  // 6. Test Missing Required Fields
  it("Should reject registration if the password field is missing completely", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "missingpassword@example.com",
      // Password field omitted entirely
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  // 7. Test Invalid Email Format 
  it("Should reject registration if email format is invalid", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "not-a-real-email", // No @ symbol or domain
      password: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
  });

  // 8. Test Non-existent User Login
  it("Should reject login for an email that does not exist in the database", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBeGreaterThanOrEqual(400); 
    expect(res.body.message).toBe("Invalid email or password"); 
  });
});