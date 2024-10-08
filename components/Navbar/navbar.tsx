"use client";

import Image from "next/image";
import { useState } from "react";
import { NavbarTabs } from "./tabs";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { CircleUser } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { resetAuthContext } from "@/lib/actions";
import { useProfileData } from "@/app/hooks/useProfileData";
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
        console.log("Profile data refreshed:", data);
      } else {
        console.error("Failed to refresh profile data:", error);
      }
    }
  };

  return (
    <header className="sticky top-0 flex p-2 h-16 items-center gap-4 border-b bg-background bg-opacity-50 backdrop-blur z-10">
        <Image
          src="/destiny-logo.svg"
          alt="dsnLogo"
          height={40}
          width={40}
        />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <span className="text-base">Hi, {displayName}</span>{" "}
        <NavbarTabs />
        <div className="ml-auto flex-1 sm:flex-initial animate-pulse">
          my-guardians.com
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full"
          onClick={handleRefreshProfileData}
        >
          {isRefreshing ? (
            <motion.div {...spinAnimation}>
              <Image
                src="/destiny-logo.svg"
                alt="dsnLogo"
                height={20}
                width={20}
              />
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
