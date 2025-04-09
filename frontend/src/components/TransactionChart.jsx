// components/TransactionChart.jsx
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CATEGORY_COLORS = [
  '#e6194b', '#f58231', '#ffe119', '#bfef45', '#3cb44b',
  '#42d4f4', '#4363d8', '#911eb4', '#f032e6', '#fabebe',
  '#ffd8b1', '#aaffc3', '#dcbeff'
];

const TransactionChart = ({ transactions, timeRange }) => {
  const grouped = useMemo(() => {
    const groups = {};
    const format = (d) => {
      const date = new Date(d);
      switch (timeRange) {
        case "Everything": return date.getFullYear();
        case "Year": return date.toLocaleString('default', { month: 'short' });
        case "Month":
        case "Week": return date.toLocaleDateString();
        case "Day": return "Today";
        default: return "Unknown";
      }
    };

    for (const tx of transactions) {
      const key = format(tx.transactionDate);
      const category = tx.category || "Other";
      const type = parseFloat(tx.amount) > 0 ? "income" : "expense";
      const absAmt = Math.abs(parseFloat(tx.amount));
      if (!groups[key]) groups[key] = {};
      if (!groups[key][category]) groups[key][category] = { income: 0, expense: 0 };
      groups[key][category][type] += absAmt;
    }

    return groups;
  }, [transactions, timeRange]);

  const allCategories = Array.from(
    new Set(Object.values(grouped).flatMap(obj => Object.keys(obj)))
  );

  const datasets = [];

  let colorIndex = 0;
  
  // First add income datasets
  for (const category of allCategories) {
    const hasIncome = Object.values(grouped).some(
      (entry) => entry[category]?.income > 0
    );
    if (hasIncome) {
      datasets.push({
        label: category,
        data: Object.keys(grouped).map(
          (label) => grouped[label][category]?.income || 0
        ),
        backgroundColor: CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length],
        stack: "income",
      });
      colorIndex++;
    }
  }
  
  // Then add expense datasets
  for (const category of allCategories) {
    const hasExpense = Object.values(grouped).some(
      (entry) => entry[category]?.expense > 0
    );
    if (hasExpense) {
      datasets.push({
        label: category,
        data: Object.keys(grouped).map(
          (label) => grouped[label][category]?.expense || 0
        ),
        backgroundColor: CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length],
        stack: "expense",
      });
      colorIndex++;
    }
  }
  

  const chartData = {
    labels: Object.keys(grouped),
    datasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          boxWidth: 12,
          padding: 10,
        }
      },
    },
    scales: {
      x: {
        stacked: timeRange !== "Day",
        ticks: { color: '#fff' },
        grid: { color: '#333' },
      },
      y: {
        stacked: timeRange !== "Day",
        ticks: { color: '#fff' },
        grid: { color: '#444' },
      },
    },
  };

  return (
    <div className="mt-6 bg-card rounded-xl p-4">
      <h3 className="text-white text-lg font-semibold mb-4">Transaction Summary</h3>
      <Bar data={chartData} options={chartOptions} />

    </div>
  );
};

export default TransactionChart;
