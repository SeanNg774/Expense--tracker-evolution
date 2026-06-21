const { getMonthlyData, getExpenseByCategory } = require("../components/expenses/chartData");

const YEAR = 2026;

function tx({ income, amount, month, day = 15, category, title }) {
  return {
    income,
    amount,
    title,
    category,
    createdAt: new Date(YEAR, month, day).toISOString(),
  };
}

describe("getMonthlyData", () => {
  it("returns 0 for every month when there are no transactions", () => {
    const result = getMonthlyData([], YEAR);
    expect(result.income).toEqual(Array(12).fill(0));
    expect(result.expense).toEqual(Array(12).fill(0));
  });

  it("updates the chart total when a new transaction is added", () => {
    const before = [tx({ income: false, amount: 50, month: 2 })];
    expect(getMonthlyData(before, YEAR).expense[2]).toBe(50);

    const after = [...before, tx({ income: false, amount: 70, month: 2 })];
    expect(getMonthlyData(after, YEAR).expense[2]).toBe(120);
  });

  it("handles a very large transaction amount without errors", () => {
    const items = [tx({ income: false, amount: 999999999, month: 7 })];
    const result = getMonthlyData(items, YEAR);
    expect(result.expense[7]).toBe(999999999);
  });

  it("keeps income and expense totals separate in the same month", () => {
    const items = [
      tx({ income: true, amount: 2000, month: 5 }),
      tx({ income: false, amount: 300, month: 5 }),
    ];
    const result = getMonthlyData(items, YEAR);
    expect(result.income[5]).toBe(2000);
    expect(result.expense[5]).toBe(300);
  });
});

describe("getExpenseByCategory", () => {
  it("groups expenses by category for the selected month", () => {
    const items = [
      tx({ income: false, amount: 40, month: 3, category: "Food" }),
      tx({ income: false, amount: 10, month: 3, category: "Food" }),
      tx({ income: false, amount: 25, month: 3, category: "Transport" }),
    ];
    const result = getExpenseByCategory(items, 3);
    expect(result).toEqual({ Food: 50, Transport: 25 });
  });

  it('falls back to "Other" when a transaction has no category', () => {
    const items = [tx({ income: false, amount: 15, month: 6 })];
    const result = getExpenseByCategory(items, 6);
    expect(result).toEqual({ Other: 15 });
  });
});
