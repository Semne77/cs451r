import { Coins } from 'lucide-react';
import LoginForm from "../components/LoginForm";   // <- corrected
import landingGraphic from "../assets/landingGraphic.jpg";

export default function Landing() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Logo and Login */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Coins className="size-12 text-blue-400" />
            </div>
            CommonCents
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-fit">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side - Background Image */}
      <div className="relative hidden bg-black lg:block">
        <img src={landingGraphic} alt="Landing Graphic" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
