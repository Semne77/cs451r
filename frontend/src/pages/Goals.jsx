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

export default function Goals() {

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

    const [timeRange, setTimeRange] = useState("Year");

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

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        return new Date(b.transactionDate) - new Date(a.transactionDate); // Newest first
    });

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



    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full mr-8 ml-8 mt-4 flex-col">
                <h1 className="text-white text-2xl font-bold">Track your goals!</h1>
            </div>
        </div>
    )
}