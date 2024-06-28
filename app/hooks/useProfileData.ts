import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/fetchDestinyProfile";

export const useProfileData = (membershipId: string | null) => {
  return useQuery({
    queryKey: ["profileData", membershipId],
    queryFn: async () => {
      if (!membershipId) throw new Error("No membershipId provided");

      const fetchedProfile = await getProfile(membershipId);
      localStorage.setItem("profile", JSON.stringify(fetchedProfile));
      return fetchedProfile;
    },
    enabled: !!membershipId,
    staleTime: 10000, // 10 seconds
    gcTime: 300000, // 5 minutes
    refetchInterval: 30000, // 30 seconds
  });
};
