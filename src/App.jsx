import { useEffect, useState } from "react";

import classes from "./App.module.css";

import Card from "./components/UI/Card";
import Header from "./components/Header";
import Expense from "./components/expenses/Expense";
import Section from "./components/UI/Section";
import ItemList from "./components/items/ItemList";
import ItemForm from "./components/items/ItemForm";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
} from "./services/transactionApi";

function App() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

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
      <ItemList onDeleteItem={deleteItemHandler} items={items} />
      <Section>Add new transaction</Section>
      <ItemForm onAddItem={onAddItemHandler} />
    </Card>
  );
}

export default App;
