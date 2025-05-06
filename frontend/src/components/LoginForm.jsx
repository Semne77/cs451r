import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react"

export function LoginForm({ className, ...props }) {

    const [validLogIn, setValidLogIn] = useState(true);

    const navigate = useNavigate();



    const handleLogin = async (evt) => {
        // Prevent the form from refreshing the page (default behavior of form submission)
        evt.preventDefault();
    
        // 🧾 Create a userInfo object with values from the form inputs
        const userInfo = {
            email: evt.target.email.value,      // Grab email input value
            password: evt.target.password.value // Grab password input value
        };
    
        // Send a POST request to the backend to validate login credentials
        let response = await axios.post("http://localhost:8080/users/getUser", userInfo);
        
        // Extract the response body (actual user data)
        response = response.data;
    
        // If email is 'unknown', it means login failed (wrong email/password)
        if (response.email === "unknown") {
            setValidLogIn(false); // Trigger an error message in the UI
        } 
        else {
            //  Login is successful
            setValidLogIn(true);
    
            // Save the logged-in user's ID in localStorage (used for future auth checks)
            localStorage.setItem("userId", response.userId);
    
            // Redirect the user to their personal dashboard
            navigate(`/dashboard/${response.userId}`);
        }
    };
    

    return (
        <form onSubmit={handleLogin} className={cn("flex flex-col gap-6 w-110", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center pb-2">
                <h1 className="text-4xl font-bold text-white">Login to your account</h1>
                <p className="text-balance text-md text-gray-500">Enter your email below to login to your account</p>
            </div>
            <div className="grid gap-6 text-gray-500">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input className="text-white h-11" id="email" type="email" required />
                </div>
                <div className="grid gap-2 mt-1">
                    <div className="flex items-center text-gray-500">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" className="text-white h-11" required />
                </div>
                <Button type="submit" className="w-full mt-3 h-11 bg-blue-600 text-white hover:bg-blue-400 hover:text-white hover:cursor-pointer">Login</Button>
            </div>
            <div className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <a href="/signUp" className="hover:text-blue-400 ml-1 text-white underline underline-offset-4">Sign up</a >
            </div>
            {validLogIn ? null : <Alert className="bg-red-300 border-0">
                <AlertTitle>Login error:</AlertTitle>
                <AlertDescription className="text-black">
                    The wrong email or password was entered.
                </AlertDescription>
            </Alert>}
        </form>
    )
}
