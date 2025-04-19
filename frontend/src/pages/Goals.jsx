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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/users/${params.id}`);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, [params.id]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full mr-8 ml-8 mt-4 flex-col">
                <h1 className="text-white text-2xl font-bold">Track your goals!</h1>
            </div>
        </div>
    )
}
