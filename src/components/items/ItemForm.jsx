import { useState } from "react";

import classes from "./ItemForm.module.css";

import Card from "../UI/Card";

const getToday = () => new Date().toISOString().slice(0, 10);

const ItemForm = (props) => {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredCategory, setEnteredCategory] = useState(props.categories[0]);
  const [enteredDate, setEnteredDate] = useState(getToday());
  const [isIncome, setIsIncome] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();

    if (
      enteredTitle.trim() === "" ||
      enteredAmount.trim() === "" ||
      +enteredAmount <= 0 ||
      enteredCategory.trim() === "" ||
      enteredDate.trim() === "" ||
      isIncome === ""
    ) {
      return;
    }

    const item = {
      title: enteredTitle.trim(),
      amount: +enteredAmount,
      income: isIncome,
      category: enteredCategory,
      date: enteredDate,
    };

    setIsSubmitting(true);

    try {
      await props.onAddItem(item);
      setEnteredTitle("");
      setEnteredAmount("");
      setEnteredCategory(props.categories[0]);
      setEnteredDate(getToday());
      setIsIncome("");
    } catch {
      // The parent displays API errors and preserves the entered values.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={classes.wrapper}>
      <form onSubmit={submitHandler}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          onChange={(event) => setEnteredTitle(event.target.value)}
          placeholder="Enter title..."
          type="text"
          value={enteredTitle}
        />
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          min="0.01"
          onChange={(event) => setEnteredAmount(event.target.value)}
          placeholder="Enter amount..."
          step="0.01"
          type="number"
          value={enteredAmount}
        />
        <div className={classes["form-row"]}>
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              onChange={(event) => setEnteredCategory(event.target.value)}
              value={enteredCategory}
            >
              {props.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              onChange={(event) => setEnteredDate(event.target.value)}
              type="date"
              value={enteredDate}
            />
          </div>
        </div>
        <div className={classes["radio-buttons"]}>
          <p>Transaction type</p>
          <div className={classes["type-options"]}>
            <div>
              <input
                checked={isIncome === true}
                id="income"
                name="item-type"
                onChange={() => setIsIncome(true)}
                type="radio"
              />
              <label htmlFor="income">Income</label>
            </div>
            <div>
              <input
                checked={isIncome === false}
                id="expense"
                name="item-type"
                onChange={() => setIsIncome(false)}
                type="radio"
              />
              <label htmlFor="expense">Expense</label>
            </div>
          </div>
        </div>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add transaction"}
        </button>
      </form>
    </Card>
  );
};

export default ItemForm;
