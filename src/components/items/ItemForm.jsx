import { useState } from "react";

import classes from "./ItemForm.module.css";

import Card from "../UI/Card";

// A form for entering the transactions
const ItemForm = (props) => {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [isIncome, setIsIncome] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const amountHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (
      enteredTitle.trim() !== "" &&
      enteredAmount.trim() !== "" &&
      isIncome !== ""
    ) {
      const item = {
        title: enteredTitle,
        amount: +enteredAmount,
        income: isIncome,
      };

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
          type="number"
          placeholder="Enter amount..."
          value={enteredAmount}
          onChange={amountHandler}
        ></input>
        <div className={classes["radio-buttons"]}>
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
        <button disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add transaction"}
        </button>
      </form>
    </Card>
  );
};

export default ItemForm;
