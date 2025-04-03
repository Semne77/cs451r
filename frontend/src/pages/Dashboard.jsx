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

    const [timeRange, setTimeRange] = useState("Everything");

    const timeRanges = ["Day", "Week", "Month", "Year", "Everything"];

    const calculateTotals = () => {
        const now = new Date();
        let filtered = transactions;
      
        if (timeRange !== "Everything") {
            const msPer = {
                Day: 1000 * 60 * 60 * 24,
                Week: 1000 * 60 * 60 * 24 * 7,
                Month: 1000 * 60 * 60 * 24 * 30,
                Year: 1000 * 60 * 60 * 24 * 365,
            };
      
            const cutoff = new Date(now.getTime() - msPer[timeRange]);
      
            filtered = transactions.filter((t) => {
                const txDate = new Date(t.transactionDate);
                return txDate >= cutoff;
            });
        }
      
        let income = 0;
        let spending = 0;
      
        for (const t of filtered) {
            const amt = parseFloat(t.amount);
            if (amt > 0) income += amt;
            else spending += -amt; // make it positive
        }
      
        const savings = income - spending;
      
        return {
            income: income.toFixed(2),
            spending: spending.toFixed(2),
            savings: savings.toFixed(2),
        };
    };

    const { income, spending, savings } = calculateTotals();

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
            </div>
        </div>
    )
}