import { useState } from "react";

import classes from "./ItemForm.module.css";

import Card from "../UI/Card";

const getToday = () => new Date().toISOString().slice(0, 10);

// A form for entering the transactions
const ItemForm = (props) => {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredCategory, setEnteredCategory] = useState(props.categories[0]);
  const [enteredDate, setEnteredDate] = useState(getToday());
  const [isIncome, setIsIncome] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const amountHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const categoryHandler = (event) => {
    setEnteredCategory(event.target.value);
  };

  const dateHandler = (event) => {
    setEnteredDate(event.target.value);
  };

  const submitHandler = (event) => {
  const submitHandler = async (event) => {
    event.preventDefault();

    if (
      enteredTitle.trim() !== "" &&
      enteredAmount.trim() !== "" &&
      +enteredAmount > 0 &&
      enteredCategory.trim() !== "" &&
      enteredDate.trim() !== "" &&
      isIncome !== ""
    ) {
      const item = {
        title: enteredTitle,
        amount: +enteredAmount,
        income: isIncome,
        category: enteredCategory,
        date: enteredDate,
      };

      setEnteredTitle("");
      setEnteredAmount("");
      setEnteredCategory(props.categories[0]);
      setEnteredDate(getToday());
      setIsIncome("");
      setIsSubmitting(true);

      try {
        await props.onAddItem(item);
        setEnteredTitle("");
        setEnteredAmount("");
        setIsIncome("");
      } catch {
        // The parent displays API errors and preserves the entered values.
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className={classes.wrapper}>
      <form onSubmit={submitHandler}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter title..."
          value={enteredTitle}
          onChange={titleHandler}
        ></input>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          min="0.01"
          step="0.01"
          type="number"
          placeholder="Enter amount..."
          value={enteredAmount}
          onChange={amountHandler}
        ></input>
        <div className={classes["form-row"]}>
          <div>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={enteredCategory}
              onChange={categoryHandler}
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
              type="date"
              value={enteredDate}
              onChange={dateHandler}
            ></input>
          </div>
        </div>
        <div className={classes["radio-buttons"]}>
          <p>Transaction type</p>
          <div className={classes["type-options"]}>
            <div>
              <input
                id="income"
                type="radio"
                name="item-type"
                checked={isIncome === true}
                onChange={() => setIsIncome(true)}
              ></input>
              <label htmlFor="income">Income</label>
            </div>
            <div>
              <input
                id="expense"
                type="radio"
                name="item-type"
                checked={isIncome === false}
                onChange={() => setIsIncome(false)}
              ></input>
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
