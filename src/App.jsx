import { useEffect, useMemo, useState } from "react";

import classes from "./App.module.css";

import Card from "./components/UI/Card";
import Header from "./components/Header";
import Expense from "./components/expenses/Expense";
import Section from "./components/UI/Section";
import ItemList from "./components/items/ItemList";
import ItemForm from "./components/items/ItemForm";
import TransactionControls from "./components/items/TransactionControls";

// 1. Import your Auth component
import Auth from "./components/auth/Auth";

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
} from "./services/transactionApi";

const TRANSACTION_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Salary",
  "Other",
];

function App() {
  // 2. Add Authentication State
  const [user, setUser] = useState(null);

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Check for existing login session on page refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ username: "User" }); // Bypass login if token exists
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // 3. ONLY fetch transactions IF a user is logged in
  useEffect(() => {
    if (!user) return; // Stop the code here if no user is authenticated

    const loadTransactions = async () => {
      try {
        const transactions = await getTransactions();
        setItems(transactions);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [user]); // The [user] dependency means this runs immediately after they log in!

  const filteredItems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const category = item.category || "Other";
      const matchesSearch =
        normalizedSearchTerm === "" ||
        item.title.toLowerCase().includes(normalizedSearchTerm) ||
        category.toLowerCase().includes(normalizedSearchTerm);
      const matchesCategory =
        selectedCategory === "All" || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  const onAddItemHandler = async (enteredItem) => {
    setError("");

    try {
      const createdTransaction = await createTransaction(enteredItem);
      setItems((prevItems) => [createdTransaction, ...prevItems]);
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const deleteItemHandler = async (id) => {
    setError("");

    try {
      await deleteTransaction(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const clearFiltersHandler = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <Card className={classes.container}>
      <Header items={items} />
      <Expense items={items} />
      <Section>History</Section>
      {isLoading && <p className={classes["no-history"]}>Loading...</p>}
      {error && <p className={classes["no-history"]}>{error}</p>}
      {!isLoading && !error && items.length === 0 && (
        <p className={classes["no-history"]}>
          No transaction found. Try adding one!
        </p>
      )}
      {!isLoading && items.length > 0 && (
        <>
          <TransactionControls
            categories={TRANSACTION_CATEGORIES}
            filteredCount={filteredItems.length}
            onCategoryChange={setSelectedCategory}
            onClearFilters={clearFiltersHandler}
            onSearchChange={setSearchTerm}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            totalItems={items.length}
          />
          {filteredItems.length === 0 ? (
            <p className={classes["no-history"]}>
              No transactions match the current search or category filter.
            </p>
          ) : (
            <ItemList onDeleteItem={deleteItemHandler} items={filteredItems} />
          )}
        </>
      )}
      <Section>Add new transaction</Section>
      <ItemForm
        categories={TRANSACTION_CATEGORIES}
        onAddItem={onAddItemHandler}
      />
    </Card>
  // 4. The Authentication Gatekeeper
  if (!user) {
    return <Auth onAuthSuccess={(userData) => setUser(userData)} />;
  }

  // 5. The Main Application View (Secured)
  return (
    <div style={{ paddingBottom: '20px' }}>
      {/* Logout Header */}
      <div style={{ textAlign: 'right', padding: '10px 20px' }}>
        <span>Welcome, <strong>{user.username}</strong>! </span>
        <button 
          onClick={handleLogout} 
          style={{ marginLeft: '10px', cursor: 'pointer', padding: '5px 10px' }}
        >
          Logout
        </button>
      </div>

      <Card className={classes.container}>
        <Header items={items} />
        <Expense items={items} />
        <Section>History</Section>
        {isLoading && <p className={classes["no-history"]}>Loading...</p>}
        {error && <p className={classes["no-history"]}>{error}</p>}
        {!isLoading && !error && items.length === 0 && (
          <p className={classes["no-history"]}>
            No transaction found. Try adding one!
          </p>
        )}
        <ItemList onDeleteItem={deleteItemHandler} items={items} />
        <Section>Add new transaction</Section>
        <ItemForm onAddItem={onAddItemHandler} />
      </Card>
    </div>
  );
}

export default App;