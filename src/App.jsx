import { useMemo, useState } from "react";

import classes from "./App.module.css";

import Card from "./components/UI/Card";
import Header from "./components/Header";
import Expense from "./components/expenses/Expense";
import Section from "./components/UI/Section";
import ItemList from "./components/items/ItemList";
import ItemForm from "./components/items/ItemForm";
import TransactionControls from "./components/items/TransactionControls";

const TRANSACTION_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Salary",
  "Other",
];

function App() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        normalizedSearchTerm === "" ||
        item.title.toLowerCase().includes(normalizedSearchTerm) ||
        item.category.toLowerCase().includes(normalizedSearchTerm);
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

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

  const clearFiltersHandler = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <Card className={classes.container}>
      <Header items={items} />
      <Expense items={items} />
      <Section>History</Section>
      {items.length === 0 && (
        <p className={classes["no-history"]}>
          No transaction found. Try adding one!
        </p>
      )}
      {items.length > 0 && (
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
  );
}

export default App;
