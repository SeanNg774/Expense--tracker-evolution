# Expense Tracker

Expense Tracker is a full-stack expense management application built with React, Vite, Express, and MongoDB. It supports user authentication and stores each user's transaction records separately.

## Features

- User registration and login with JSON Web Token (JWT) authentication
- Password hashing before user records are stored
- User-specific transaction data and protected transaction routes
- Income and expense transaction tracking
- Transaction categories: Food, Transport, Bills, Shopping, Salary, and Other
- Transaction date recording
- Search by transaction title or category
- Category-based filtering, result counts, and a clear-filter action
- Persistent MongoDB storage
- Responsive transaction form and history cards
- Transaction deletion with ownership verification

## Technology Stack

### Frontend

- React 18
- Vite
- CSS Modules

### Backend

- Node.js 18 or later
- Express
- MongoDB and Mongoose
- JWT authentication
- bcrypt password hashing

## Project Structure

```text
.
|-- src/                    # React frontend
|   |-- components/         # UI, authentication, expense, and transaction components
|   `-- services/           # Transaction API requests
|-- server/                 # Express backend
|   |-- config/             # MongoDB connection
|   |-- controllers/        # Authentication and transaction logic
|   |-- middleware/         # JWT authentication middleware
|   |-- models/             # User and transaction schemas
|   `-- routes/             # API routes
|-- index.html
|-- package.json
`-- vite.config.js
```

## Installation

Clone the repository and install the frontend dependencies:

```bash
git clone https://github.com/SeanNg774/Expense--tracker-evolution.git
cd Expense--tracker-evolution
npm install
```

Install the backend dependencies:

```bash
cd server
npm install
```

## Environment Configuration

Create a file named `.env` inside the `server` directory:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=<strong-random-secret>
```

Replace the placeholder values with your own configuration. Never commit the real `.env` file, database password, or JWT secret to GitHub.

## Running the Application

Start the backend from the `server` directory:

```bash
npm start
```

In a separate terminal, start the frontend from the project root:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). The backend runs at [http://localhost:5001](http://localhost:5001).

To confirm that the backend is running, visit:

```text
http://localhost:5001/api/health
```

## User Guide

1. Open the application and select **Register here** to create an account.
2. Enter a username, email address, and password of at least six characters.
3. Log in with the registered email address and password.
4. Enter a transaction title and positive amount.
5. Select a category, date, and transaction type: **Income** or **Expense**.
6. Select **Add transaction** to save the record to MongoDB.
7. Use the search field to find records by title or category.
8. Use the category selector to display records from one category.
9. Select **Clear** to reset the current search and category filter.
10. Select a transaction card and use the delete button to remove the record.
11. Select **Logout** to remove the local login token and clear the displayed session data.

## API Endpoints

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Check backend availability |
| POST | `/api/auth/register` | No | Register a user and return a JWT |
| POST | `/api/auth/login` | No | Log in and return a JWT |
| GET | `/api/transactions` | Bearer token | Retrieve the authenticated user's transactions |
| POST | `/api/transactions` | Bearer token | Create a transaction for the authenticated user |
| DELETE | `/api/transactions/:id` | Bearer token | Delete a transaction owned by the authenticated user |

Protected requests use the following header:

```http
Authorization: Bearer <token>
```

## Data Management and Security

Transactions store a title, positive amount, income or expense type, category, date, and user reference. The backend validates incoming transaction data before saving it.

The JWT middleware verifies protected requests and identifies the current user. Transaction queries are filtered by that user ID, and deletion is allowed only when the authenticated user owns the selected transaction.

## Build Validation

Create a production frontend build with:

```bash
npm run build
```

The generated output is written to the `dist` directory.

## Testing

This project utilizes **Jest** for automated testing, separated into two isolated suites to prevent environment conflicts between the React frontend and the Node.js backend. 

### Frontend Testing
The frontend test suite verifies the isolated data aggregation algorithms (Chart.js calculations) and dynamic search/filtering logic without needing to render the DOM or connect to a database.

**To run the frontend tests:**
1. Open your terminal in the **root** directory of the project.
2. Ensure dependencies are installed (`npm install`).
3. Run the following command:
   ```bash
   npm test

### Backend Testing
The backend test suite uses Supertest to simulate HTTP requests. It tests the complete data flow from the Express routers, through the authentication controllers, down to the MongoDB database.

Prerequisites: Ensure your server/.env file contains a valid MONGO_URI .

**To run the backend tests:**

Open your terminal and navigate to the server directory:

```bash
cd server
```
Ensure backend dependencies are installed (`npm install`).

Run the following command:

```Bash
npm test
```


## License

This project is open source and licensed under the MIT License.

Copyright (c) 2022 GabrielLiima
