import { filterTransactions } from "../utils/transactionFilters";

const transactions = [
  { id: "1", title: "Lunch", amount: 12, category: "Food", income: false },
  { id: "2", title: "Bus fare", amount: 3, category: "Transport", income: false },
  { id: "3", title: "Monthly salary", amount: 2500, category: "Salary", income: true },
  { id: "4", title: "Notebook", amount: 8, income: false },
];

describe("filterTransactions", () => {
  test("returns all transactions when no search term or category filter is selected", () => {
    expect(filterTransactions(transactions, "", "All")).toEqual(transactions);
  });

  test("searches transactions by title without case sensitivity", () => {
    expect(filterTransactions(transactions, "salary", "All")).toEqual([
      transactions[2],
    ]);
  });

  test("searches transactions by category", () => {
    expect(filterTransactions(transactions, "transport", "All")).toEqual([
      transactions[1],
    ]);
  });

  test("filters transactions by selected category", () => {
    expect(filterTransactions(transactions, "", "Food")).toEqual([
      transactions[0],
    ]);
  });

  test("combines search and category filters", () => {
    expect(filterTransactions(transactions, "bus", "Transport")).toEqual([
      transactions[1],
    ]);
  });

  test("uses Other as the fallback category for transactions without a category", () => {
    expect(filterTransactions(transactions, "", "Other")).toEqual([
      transactions[3],
    ]);
  });

  test("returns an empty list when no transactions match", () => {
    expect(filterTransactions(transactions, "rent", "Bills")).toEqual([]);
  });
});
