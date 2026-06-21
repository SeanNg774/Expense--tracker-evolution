const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Builds the monthly income/expense totals used by the bar chart.
 * Only transactions from the given year are included, so the chart
 * always reflects the current year's activity.
 */
function getMonthlyData(items, year = new Date().getFullYear()) {
  const income = Array(12).fill(0);
  const expense = Array(12).fill(0);

  items.forEach((item) => {
    const date = new Date(item.createdAt);
    if (date.getFullYear() !== year) return;

    const month = date.getMonth();
    if (item.income) {
      income[month] += item.amount;
    } else {
      expense[month] += item.amount;
    }
  });

  return { income, expense };
}

/**
 * Builds a category -> total map of expenses for a single month,
 * used by the pie chart. Falls back to the transaction title, then
 * "Other", when no category is set.
 */
function getExpenseByCategory(items, selectedMonth) {
  const map = {};

  items
    .filter((item) => {
      const date = new Date(item.createdAt);
      return !item.income && date.getMonth() === selectedMonth;
    })
    .forEach((item) => {
      const key = item.category || item.title || "Other";
      map[key] = (map[key] || 0) + item.amount;
    });

  return map;
}

module.exports = { MONTHS, getMonthlyData, getExpenseByCategory };
