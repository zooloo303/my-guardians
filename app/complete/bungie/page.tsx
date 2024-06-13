"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions";
import { useAuthContext } from "@/components/Auth/AuthContext";

const BungieAuth = () => {
  const router = useRouter();
  const { setAuthInfo } = useAuthContext();
  const [isCodeUsed, setIsCodeUsed] = useState(false);
  const hasRun = useRef(false); // Ref to track if useEffect has run

  useEffect(() => {
    const authenticate = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code && !isCodeUsed && !hasRun.current) {
        setIsCodeUsed(true);
        hasRun.current = true; // Mark that the effect has run

        // Remove code from URL to prevent reuse
        url.searchParams.delete("code");
        window.history.replaceState({}, document.title, url.toString());

        const data = { code: code };
        const headers = { "Content-Type": "application/x-www-form-urlencoded" };

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/api/user/bungie/auth/`,
            {
              method: "POST",
              headers: headers,
              body: new URLSearchParams(data),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to exchange code");
          }

          const responseData = await response.json();
          const { membership_id, displayName } = responseData;

          // Set authentication info in context
          setAuthInfo(membership_id, displayName);

          handleLogin(membership_id);

          // Delay navigation to ensure cookies are set
          setTimeout(() => {
            router.push("/");
          }, 100);
        } catch (error) {
          console.error("Error:", error);
          // Handle errors, possibly reset isCodeUsed if you want to allow retry
        }
      }
    };

    authenticate();
  }, [isCodeUsed, router, setAuthInfo]);

  return (
    <main className="pt-48 max-w-[1500px] mx-auto px-6">
      <div className="py-60">Authenticating with Bungie...</div>
    </main>
  );
};

export default BungieAuth;
