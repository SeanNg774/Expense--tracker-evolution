import classes from "./TransactionControls.module.css";

const TransactionControls = (props) => {
  const hasActiveFilters =
    props.searchTerm.trim() !== "" || props.selectedCategory !== "All";

  return (
    <div className={classes.controls}>
      <div className={classes["summary-row"]}>
        <span>
          Showing {props.filteredCount} of {props.totalItems} transactions
        </span>
        <button
          disabled={!hasActiveFilters}
          onClick={props.onClearFilters}
          type="button"
        >
          Clear
        </button>
      </div>
      <div className={classes["filter-grid"]}>
        <div>
          <label htmlFor="transaction-search">Search</label>
          <input
            id="transaction-search"
            onChange={(event) => props.onSearchChange(event.target.value)}
            placeholder="Search by title or category"
            type="search"
            value={props.searchTerm}
          />
        </div>
        <div>
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            onChange={(event) => props.onCategoryChange(event.target.value)}
            value={props.selectedCategory}
          >
            <option value="All">All categories</option>
            {props.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionControls;
