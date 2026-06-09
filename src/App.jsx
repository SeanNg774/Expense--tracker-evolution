import React, { useState, useEffect } from "react"; // Added useEffect and React

import classes from "./App.module.css";

import Card from "./components/UI/Card";
import Header from "./components/Header";
import Expense from "./components/expenses/Expense";
import Section from "./components/UI/Section";
import ItemList from "./components/items/ItemList";
import ItemForm from "./components/items/ItemForm";

// 1. Import your new Auth component
import Auth from "./components/auth/Auth"; 

function App() {
  // --- NEW: Authentication State ---
  const [user, setUser] = useState(null);

  // --- EXISTING: Expense Tracker State ---
  const [items, setItems] = useState([]);

  // Check if user is already logged in upon refreshing the page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, mock a logged-in user so they don't have to log in again
      setUser({ username: "User" }); 
    }
  }, []);

  // Handle logging out
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // --- EXISTING: Expense Tracker Logic ---
  const onAddItemHandler = (enteredItems) => {
    setItems((prevItems) => {
      return [enteredItems, ...prevItems];
    });
  };

  const deleteItemHandler = (id) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      return updatedItems;
    });
  };

  // --- NEW: Conditional Rendering ---
  
  // If there is NO user logged in, only show the Auth screen
  if (!user) {
    return <Auth onAuthSuccess={(userData) => setUser(userData)} />;
  }

  // If there IS a user logged in, show the full Expense Tracker
  return (
    <div style={{ paddingBottom: '20px' }}>
      {/* A simple top bar to show the logged-in user and a logout button */}
      <div style={{ textAlign: 'right', padding: '10px 20px' }}>
        <span>Welcome, <strong>{user.username}</strong>! </span>
        <button 
          onClick={handleLogout} 
          style={{ marginLeft: '10px', cursor: 'pointer', padding: '5px 10px' }}
        >
          Logout
        </button>
      </div>

      {/* Your original untouched Expense Tracker UI */}
      <Card className={classes.container}>
        <Header items={items} />
        <Expense items={items} />
        <Section>History</Section>
        {items.length === 0 && (
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