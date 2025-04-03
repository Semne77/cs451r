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
    


    return (
        <div className="flex">
            <Sidebar />
            <div className=" ml-8 mt-4 flex-col">
                <h1 className="text-white text-2xl font-bold">Welcome to your dashboard, {firstName || "loading"}</h1>
                <div className="w-277 h-fit mt-4 flex justify-between">
                    <div className="flex-col w-85 h-32 bg-card rounded-2xl ">
                        <p className="text-white ml-7 mb-3 mt-6 text-sm font-light">Total Income</p>
                        <span className="ml-7 text-white font-bold text-2xl">$0.00</span>
                        <p className="text-gray-400 ml-7 mt-1 text-xs font-light">No change in this time period</p>
                    </div>
                    <div className="w-85 h-32 bg-card rounded-2xl">
                        <p className="text-white ml-7 mb-3 mt-6 text-sm font-light">Total Spending</p>
                        <span className="ml-7 text-white font-bold text-2xl">$0.00</span>
                        <p className="text-gray-400 ml-7 mt-1 text-xs font-light">No change in this time period</p>
                    </div>
                    <div className="w-85 h-32 bg-card rounded-2xl">
                        <p className="text-white ml-7 mb-3 mt-6 text-sm font-light">Total Savings</p>
                        <span className="ml-7 text-white font-bold text-2xl">$0.00</span>
                        <p className="text-gray-400 ml-7 mt-1 text-xs font-light">No change in this time period</p>
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