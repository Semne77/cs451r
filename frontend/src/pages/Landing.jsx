import { Coins } from 'lucide-react';
import { LoginForm } from "@/components/LoginForm"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10 border-r-2 border-gray-500">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium text-white">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Coins className="size-9 text-gray-500" />
                        </div>
                        CommonCents
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-black lg:block">
                <h1 class="text-8xl text-white ml-20 mt-70">The building blocks to reach financial success.</h1>
                <img
                    src="https://wallpapershome.com/images/pages/pic_v/262.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale opacity-30"
                />
            </div>
        </div>
    )
}
