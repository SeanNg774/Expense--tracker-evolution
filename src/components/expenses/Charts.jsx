import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Card from "../UI/Card";
import classes from "./Charts.module.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#a78bfa","#60a5fa","#34d399","#f87171","#fbbf24","#f472b6","#38bdf8","#fb923c"];

const Charts = ({ items }) => {
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const monthlyData = useMemo(() => {
    const income = Array(12).fill(0);
    const expense = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    items.forEach((item) => {
      const date = new Date(item.createdAt);
      if (date.getFullYear() !== currentYear) return;
      const month = date.getMonth();
      if (item.income) income[month] += item.amount;
      else expense[month] += item.amount;
    });
    return { income, expense };
  }, [items]);

  const expenseByCategory = useMemo(() => {
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
  }, [items, selectedMonth]);

  const barData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Income",
        data: monthlyData.income,
        backgroundColor: "rgba(167, 139, 250, 0.7)",
        borderColor: "#a78bfa",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Expenses",
        data: monthlyData.expense,
        backgroundColor: "rgba(248, 113, 113, 0.7)",
        borderColor: "#f87171",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { maxTicksLimit: 5 },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  const pieData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: PIE_COLORS,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const hasExpenses = Object.keys(expenseByCategory).length > 0;

  if (items.length === 0) return null;

  return (
    <div className={classes.row3}>
      <div className={classes.card}>
        <div className={classes.chartTitle}>Monthly Overview</div>
        <Bar data={barData} options={barOptions} />
      </div>

      <div className={classes.card}>
        <div className={classes.chartTitle}>Expenses Breakdown</div>
        <div className={classes.monthSelector}>
          {MONTHS.map((month, index) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(index)}
              className={`${classes.monthBtn} ${
                selectedMonth === index ? classes.monthBtnActive : ""
              }`}
            >
              {month}
            </button>
          ))}
        </div>
        {hasExpenses ? (
          <div className={classes.pieWrapper}>
            <Pie data={pieData} />
          </div>
        ) : (
          <p className={classes.noData}>
            No expenses for {MONTHS[selectedMonth]}.
          </p>
        )}
      </div>
    </div>
  );
};

export default Charts;