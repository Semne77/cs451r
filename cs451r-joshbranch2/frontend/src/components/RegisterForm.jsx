import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export function RegisterForm({ className, ...props }) {

    const navigate = useNavigate();



    const handleSignUp = async (evt) => {
        evt.preventDefault()
        const userInfo = {
            firstName: evt.target.name.value,
            lastName: evt.target.lastname.value,
            email: evt.target.email.value,
            phone: evt.target.phone.value,
            password: evt.target.password.value
        }

        let response = await axios.post("http://localhost:8080/users/newUser", userData);

        response = response.data;

        navigate(`/dashboard/${response.userId}`);
    }

    return (
        <form onSubmit={handleSignUp} className={cn("flex flex-col gap-6 w-110", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center pb-2">
                <h1 className="text-4xl font-bold text-white">Create your account</h1>
                <p className="text-balance text-md text-gray-500">Enter your information below to get started</p>
            </div>
            <div className="grid gap-6 text-gray-500">
                <div className="grid gap-2">
                    <Label htmlFor="name">First name</Label>
                    <Input className="text-white h-11" id="name" type="name" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lastname">Last name</Label>
                    <Input className="text-white h-11" id="lastname" type="lastname" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input className="text-white h-11" id="email" type="email" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input className="text-white h-11" id="phone" type="phone" required />
                </div>
                <div className="grid gap-2 mt-1">
                    <div className="flex items-center text-gray-500">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" className="text-white h-11" required />
                </div>
                <Button type="submit" className="w-full mt-3 h-11 bg-blue-600 text-white hover:bg-blue-400 hover:text-white hover:cursor-pointer">Sign Up</Button>
            </div>
            <div className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/" className="hover:text-blue-400 ml-1 text-white underline underline-offset-4">Log in</a >
            </div>
        </form>
    )
}
