"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isDestinyApiEnabled } from "@/lib/checkApiStatus";

const ApiCheck = () => {
  const router = useRouter();
  const [apiEnabled, setApiEnabled] = useState(true);
  useEffect(() => {
    const checkApiStatus = async () => {
      const enabled = await isDestinyApiEnabled();
      if (!enabled) {
        router.push("/maintenance");
        setApiEnabled(enabled);
      }
    };

    checkApiStatus();
  }, [router]);
  return !apiEnabled && <div>checking Bungie api status...</div>;
};

export default ApiCheck;
