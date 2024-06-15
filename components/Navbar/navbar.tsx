"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { resetAuthContext } from "@/lib/actions";
import { CircleUser, Search } from "lucide-react";
import { ModeToggle } from "@/components/Navbar/theme-toggle";
import { useAuthContext } from "@/components/Auth/AuthContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { displayName, setAuthInfo } = useAuthContext();

  const handleLogout = async () => {
    await resetAuthContext();
    setAuthInfo(null, null); // Clear the context state
    localStorage.removeItem("membershipId");
    localStorage.removeItem("displayName");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 flex p-2 h-16 items-center gap-4 border-b bg-background bg-opacity-50 backdrop-blur z-10">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Image src="/destiny-logo.svg" alt="dsnLogo" height={40} width={40} />
      </nav>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <span className="text-base">Hi, {displayName}</span>{" "}
        
        <div className="ml-auto flex-1 sm:flex-initial animate-pulse">my-guardians.com</div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Navbar;
