import { useEffect, useMemo, useState } from "react";
import classes from "./App.module.css";
import Card from "./components/UI/Card";
import Header from "./components/Header";
import Expense from "./components/expenses/Expense";
import Section from "./components/UI/Section";
import ItemList from "./components/items/ItemList";
import ItemForm from "./components/items/ItemForm";
import TransactionControls from "./components/items/TransactionControls";
import Charts from "./components/expenses/Charts";
import Auth from "./components/auth/Auth";
import { filterTransactions } from "./utils/transactionFilters";
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
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ username: "User" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setItems([]);
    setSearchTerm("");
    setSelectedCategory("All");
  };

  useEffect(() => {
    if (!user) return;
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
  }, [user]);

  const filteredItems = useMemo(() => {
    return filterTransactions(items, searchTerm, selectedCategory);
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

  if (!user) {
    return <Auth onAuthSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className={classes.page}>
      <div className={classes.topbar}>
        <span>Welcome, <strong>{user.username}</strong>!</span>
        <button onClick={handleLogout} className={classes.logoutBtn}>
          Logout
        </button>
      </div>

      <div className={classes.mainBox}>

        {/* ROW 1: balance + income/expense */}
        <div className={classes.row1}>
          <Header items={items} />
          <Expense items={items} />
        </div>

        {/* ROW 2: add transaction | history */}
        <div className={classes.row2}>
          <div className={classes.innerCard}>
            <Section>Add New Transaction</Section>
            <ItemForm
              categories={TRANSACTION_CATEGORIES}
              onAddItem={onAddItemHandler}
            />
          </div>

          <div className={classes.innerCard}>
            <Section>History</Section>
            <div className={classes.historyBody}>
              {isLoading && <p className={classes.noHistory}>Loading...</p>}
              {error && <p className={classes.noHistory}>{error}</p>}
              {!isLoading && !error && items.length === 0 && (
                <p className={classes.noHistory}>
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
                    <p className={classes.noHistory}>
                      No transactions match the current filter.
                    </p>
                  ) : (
                    <div className={classes.historyScroll}>
                      <ItemList
                        onDeleteItem={deleteItemHandler}
                        items={filteredItems}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ROW 3: charts */}
        <Charts items={items} />

      </div>
    </div>
  );
}

export default App;
