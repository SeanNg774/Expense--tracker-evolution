import { useState } from "react";

import classes from "./Item.module.css";

import Card from "../UI/Card";

const formatDate = (date) => {
  if (!date) {
    return "No date";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// A component that shows the title and amount of the transaction
const Item = (props) => {
  const [deleteMode, setDeleteMode] = useState(false);

  const deleteHandler = (event) => {
    event.stopPropagation();
    props.onDeleteItem(props.id);
  };

  const deleteModeHandler = () => {
    setDeleteMode(!deleteMode);
  };

  // RegEx used for thousand separators
  const search_value = /\B(?=(\d{3})+(?!\d))/g;

  return (
    <li className={classes.item} onClick={deleteModeHandler}>
      <Card className={`${props.income ? classes.income : classes.expense}`}>
        <div className={classes.details}>
          <div className={classes.title}>{props.title}</div>
          <div className={classes.meta}>
            <span>{props.category}</span>
            <span>{formatDate(props.date)}</span>
          </div>
        </div>
        <div className={classes.amount}>
          {`${props.income ? "+" : "-"}${props.amount
            .toFixed(2)
            .toString()
            .replace(search_value, ",")}`}
        </div>
        {deleteMode && (
          <button className={classes.delete} onClick={deleteHandler}>
            x
          </button>
        )}
      </Card>
    </li>
  );
};

export default Item;
