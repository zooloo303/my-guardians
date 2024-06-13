import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/Auth/AuthContext";

const useRequireAuth = () => {
  const { membershipId } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!membershipId) {
      router.push("/login");
    }
  }, [membershipId, router]);

  return membershipId;
};

export default useRequireAuth;
