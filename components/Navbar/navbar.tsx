"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { resetAuthContext } from "@/lib/actions";
import { CircleUser } from "lucide-react";
import { ModeToggle } from "@/components/Navbar/theme-toggle";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useProfileData } from "@/app/hooks/useProfileData"; // Adjust the import based on your project structure
import { motion } from "framer-motion";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const spinAnimation = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const { displayName, setAuthInfo, membershipId } = useAuthContext();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = async () => {
    await resetAuthContext();
    setAuthInfo(null, null); // Clear the context state
    localStorage.removeItem("membershipId");
    localStorage.removeItem("displayName");
    router.push("/login");
  };

  const { refetch } = useProfileData(membershipId); // Fetch profile data using the custom hook

  const handleRefreshProfileData = async () => {
    if (membershipId) {
      setIsRefreshing(true);
      const { data, error } = await refetch();
      setIsRefreshing(false);
      if (!error) {
        localStorage.setItem("profile", JSON.stringify(data));
        console.log('Profile data refreshed:', data);
      } else {
        console.error('Failed to refresh profile data:', error);
      }
    }
  };

  return (
    <header className="sticky top-0 flex p-2 h-16 items-center gap-4 border-b bg-background bg-opacity-50 backdrop-blur z-10">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Image src="/destiny-logo.svg" alt="dsnLogo" height={40} width={40} />
      </nav>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <span className="text-base">Hi, {displayName}</span>{" "}      
        <div className="ml-auto flex-1 sm:flex-initial animate-pulse">my-guardians.com</div>
        <Button variant="secondary" size="icon" className="rounded-full"
          onClick={handleRefreshProfileData}>
          {isRefreshing ? (
            <motion.div {...spinAnimation}>
                <Image src="/destiny-logo.svg" alt="dsnLogo" height={20} width={20} />
            </motion.div>  

          ) : (
            <RefreshCcw />
          )}
        </Button>
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
