import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import Sidebar from "@/components/Sidebar";
import axios from "axios";

function EmptyFieldMessage({ field }) {
    return (
        <div className="mt-64 text-gray-400 font-light text-xs text-center">No {field} to display</div>
    )
}

export default function Dashboard() {

    const params = useParams();
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await axios.get(`http://localhost:8080/users/${params.id}`);
            setFirstName(res.data.firstName);
          } catch (err) {
            console.error("Failed to fetch user:", err);
          }
        };
    
        fetchUser();
    }, [params.id]);

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
    const fetchTransactions = async () => {
        try {
        const res = await axios.get(`http://localhost:8080/transactions/${params.id}`);
        setTransactions(res.data);
        } catch (err) {
        console.error("Failed to fetch transactions:", err);
        }
    };

    fetchTransactions();
    }, [params.id]);

    const [timeRange, setTimeRange] = useState("Week");

    const [currentWindowStart, setCurrentWindowStart] = useState(new Date());

    const getDateRange = (range, baseDate) => {
        const date = new Date(baseDate);
        date.setHours(0, 0, 0, 0); // normalize time
      
        let start, end;
      
        switch (range) {
          case "Day":
            start = new Date(date);
            end = new Date(date);
            break;
      
          case "Week": {
            const day = date.getDay(); // 0 = Sunday
            start = new Date(date);
            start.setDate(date.getDate() - day); // back to Sunday
      
            end = new Date(start);
            end.setDate(start.getDate() + 6); // to Saturday
            break;
          }
      
          case "Month": {
            start = new Date(date.getFullYear(), date.getMonth(), 1);
            end = new Date(date.getFullYear(), date.getMonth() + 1, 0); // last day of this month
            break;
          }
      
          case "Year": {
            start = new Date(date.getFullYear(), 0, 1);
            end = new Date(date.getFullYear(), 11, 31);
            break;
          }
      
          default:
            start = null;
            end = null;
        }
      
        return { start, end };
    };
      

    useEffect(() => {
        if (timeRange !== "Everything") {
          const now = new Date();
          const { start } = getDateRange(timeRange, now); // 🆕 align to calendar period
          setCurrentWindowStart(start);
        } else {
          setCurrentWindowStart(null);
        }
    }, [timeRange]);
      

    const timeRanges = ["Day", "Week", "Month", "Year", "Everything"];

    const calculateTotals = () => {
        let filtered = transactions;
      
        if (timeRange !== "Everything" && currentWindowStart) {
          const { start, end } = getDateRange(timeRange, currentWindowStart);
      
          filtered = transactions.filter((t) => {
            const txDate = new Date(t.transactionDate);
            return txDate >= start && txDate <= end;
          });
        }
      
        let income = 0;
        let spending = 0;
      
        for (const t of filtered) {
          const amt = parseFloat(t.amount);
          if (amt > 0) income += amt;
          else spending += -amt;
        }
      
        return {
          income: income.toFixed(2),
          spending: spending.toFixed(2),
          savings: (income - spending).toFixed(2),
        };
    };
      
    

    const { income, spending, savings } = calculateTotals();

    const getFilteredTransactions = () => {
        if (timeRange === "Everything" || !currentWindowStart) return transactions;
      
        const { start, end } = getDateRange(timeRange, currentWindowStart);
      
        return transactions.filter((t) => {
          const txDate = new Date(t.transactionDate);
          return txDate >= start && txDate <= end;
        });
    };
      
    const filteredTransactions = getFilteredTransactions();
      
    const shiftWindow = (direction) => {
        const current = new Date(currentWindowStart);
        let newDate = new Date(current);
      
        switch (timeRange) {
          case "Day":
            newDate.setDate(current.getDate() + direction * 1);
            break;
          case "Week":
            newDate.setDate(current.getDate() + direction * 7);
            break;
          case "Month":
            newDate.setMonth(current.getMonth() + direction * 1);
            break;
          case "Year":
            newDate.setFullYear(current.getFullYear() + direction * 1);
            break;
          default:
            return;
        }
      
        setCurrentWindowStart(newDate);
    };
      
    const goBackward = () => shiftWindow(-1);
    const goForward = () => shiftWindow(1);
    
    const formatDate = (dateInput) => {
        const date = new Date(dateInput);
      
        if (isNaN(date.getTime())) {
          return "Invalid Date";
        }
      
        return date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
    };
      
    const rangeDisplay = () => {
        if (!currentWindowStart || timeRange === "Everything") return "All Time";
      
        const { start, end } = getDateRange(timeRange, currentWindowStart);
        return `${formatDate(start)} – ${formatDate(end)}`;
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const { end } = getDateRange(timeRange, currentWindowStart);

    const forwardDisabled = end >= now;

    const backwardDisabled = transactions.every(
    (t) => new Date(t.transactionDate) >= getDateRange(timeRange, currentWindowStart).start
    );

    return (
        <div className="flex">
            <Sidebar />
            <div className=" ml-8 mt-4 flex-col">
                <h1 className="text-white text-2xl font-bold">Welcome to your dashboard, {firstName || "loading"}!</h1>
                <div className="mb-4">
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-card text-white rounded-md px-3 py-1"
                >
                    {timeRanges.map((range) => (
                    <option key={range} value={range}>
                        {range}
                    </option>
                    ))}
                </select>
                </div>
                <div className="flex items-center gap-4 text-white mb-4">
                <button onClick={goBackward} disabled={backwardDisabled}>◀</button>
                <span>{rangeDisplay()}</span>
                <button onClick={goForward} disabled={forwardDisabled}>▶</button>

                </div>
                <div className="w-277 h-fit mt-4 flex justify-between">
                    <div className="flex-col w-85 h-32 bg-card rounded-2xl">
                        <p className="text-white ml-7 mb-3 mt-6 text-sm font-light">Total Income</p>
                        <span className="ml-7 text-white font-bold text-2xl">${income}</span>
                        <p className="text-gray-400 ml-7 mt-1 text-xs font-light">In {timeRange.toLowerCase()}</p>
                    </div>
                    <div className="w-85 h-32 bg-card rounded-2xl">
                        <p className="text-white ml-7 mb-3 mt-6 text-sm font-light">Total Spending</p>
                        <span className="ml-7 text-white font-bold text-2xl">${spending}</span>
                        <p className="text-gray-400 ml-7 mt-1 text-xs font-light">In {timeRange.toLowerCase()}</p>
                    </div>
                    <div className="w-85 h-32 bg-card rounded-2xl">
                        <p className="text-white ml-7 mb-3 mt-6 text-sm font-light">Total Savings</p>
                        <span className="ml-7 text-white font-bold text-2xl">${savings}</span>
                        <p className="text-gray-400 ml-7 mt-1 text-xs font-light">In {timeRange.toLowerCase()}</p>
                    </div>
                </div>

                <div className="flex mt-4">
                    <div className="flex-col w-185 h-145 bg-card rounded-2xl">
                        <p className="text-white ml-5 mt-6 text-sm font-light">Overview</p>
                        <EmptyFieldMessage field={"data"} />
                    </div>
                    <div className="flex-col w-86 h-145 ml-6 bg-card rounded-2xl">
                        <p className="text-white ml-5 mt-6 text-sm font-light">Goals</p>
                        <EmptyFieldMessage field={"goals"} />
                    </div>
                </div>
                <div className="flex-col mt-4">
                <div className="flex-col w-full bg-card rounded-2xl mt-4 p-5">
                <p className="text-white text-sm font-light mb-3">Transactions</p>
                {filteredTransactions.length === 0 ? (
                    <p className="text-gray-400 text-xs font-light">No transactions in this time period</p>
                ) : (
                <ul className="text-white text-sm space-y-2 max-h-60 overflow-y-auto">
                {filteredTransactions.map((tx) => {
                    const isIncome = parseFloat(tx.amount) > 0;
                    const displayAmount = Math.abs(parseFloat(tx.amount)).toFixed(2);
                    const amountColor = isIncome ? "text-green-400" : "text-red-400";

                    return (
                    <li
                        key={tx.id}
                        className="flex justify-between items-start border-b border-gray-700 pb-2"
                    >
                        <div className="flex flex-col">
                        <span className="font-medium">{tx.merchant || "Unknown"}</span>
                        <span className="text-xs text-gray-400">
                            {tx.category || "Uncategorized"} • {formatDate(tx.transactionDate)}
                        </span>
                        </div>
                        <span className={`font-medium ${amountColor}`}>${displayAmount}</span>
                    </li>
                    );
                })}
                </ul>
                )}
                </div>
                </div>
            </div>
        </div>
    )
}