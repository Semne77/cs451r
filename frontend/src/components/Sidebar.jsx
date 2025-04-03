import { BadgeDollarSign, LayoutDashboard, ArrowRightLeft, Goal, Cog, LogOut } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

export default function Sidebar({ selected }) {

    useEffect(() => {
        let buttons = document.getElementById('buttons');
    }, [])

    const navigate = useNavigate();

    const params = useParams();
    console.log(params);
    console.log("this");

    return (
        <div className="sticky top-0 h-screen w-64 bg-card justify-center items-center border-r-1 border-r-gray-800">
            <section className="flex items-center ml-5 mt-5">
                <BadgeDollarSign className="text-blue-600 size-7" />
                <h1 className="text-white ml-1 mt-3">CommonCents</h1>
            </section>
            <section id="buttons" className="mt-15 flex-col ml-3 ">
                <div
                className='flex text-blue-600 items-center w-56 h-8 rounded-md hover:bg-blue-600 hover:text-white hover:cursor-pointer'
                onClick={() => navigate(`/dashboard/${params.id}`)}
                >
                    <LayoutDashboard className="size-5 ml-5" />
                    <span className="text-white text-sm font-light ml-3">Dashboard</span>
                </div>
                <div id="transactionsButton" className='flex mt-4 text-blue-600 items-center w-56 h-8 rounded-md hover:bg-blue-600 hover:text-white hover:cursor-pointer'>
                    <ArrowRightLeft className="size-5 ml-5" />
                    <span className="text-sm text-white font-light ml-3">Transactions</span>
                </div>
                <div className='flex mt-4 text-blue-600 items-center w-56 h-8 rounded-md hover:bg-blue-600 hover:text-white hover:cursor-pointer'>
                    <Goal className="size-5 ml-5" />
                    <span className="text-sm text-white font-light ml-3">Goals</span>
                </div>
                <div
                className='flex mt-4 text-blue-600 items-center w-56 h-8 rounded-md hover:bg-blue-600 hover:text-white hover:cursor-pointer'
                onClick={() => navigate(`/settings/${params.id}`)}
                >
                    <Cog className="size-5 ml-5" />
                    <span className="text-sm text-white font-light ml-3">Settings</span>
                </div>
                <div
                className='flex mt-4 text-blue-600 items-center w-56 h-8 rounded-md hover:bg-blue-600 hover:text-white hover:cursor-pointer'
                onClick={() => navigate(`/`)}
                >
                    <LogOut className="size-5 ml-5" />
                    <span className="text-sm text-white font-light ml-3">Log Out</span>
                </div>
            </section>
        </div>
    )
}