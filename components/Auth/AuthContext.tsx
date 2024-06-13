"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthContextProps } from "@/lib/interfaces";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const storedMembershipId = localStorage.getItem("membershipId");
    const storedDisplayName = localStorage.getItem("displayName");
    if (storedMembershipId) setMembershipId(storedMembershipId);
    if (storedDisplayName) setDisplayName(storedDisplayName);
  }, []);

  const setAuthInfo = (
    membershipId: string | null,
    displayName: string | null
  ) => {
    if (membershipId) {
      localStorage.setItem("membershipId", membershipId);
    } else {
      localStorage.removeItem("membershipId");
    }
    if (displayName) {
      localStorage.setItem("displayName", displayName);
    } else {
      localStorage.removeItem("displayName");
    }
    setMembershipId(membershipId);
    setDisplayName(displayName);
  };

  return (
    <AuthContext.Provider value={{ membershipId, displayName, setAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
