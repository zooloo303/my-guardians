import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/fetchDestinyProfile";

export const useProfileData = (membershipId: string | null) => {
  return useQuery({
    queryKey: ["profileData", membershipId],
    queryFn: async () => {
      if (!membershipId) throw new Error("No membershipId provided");

      const profile = localStorage.getItem("profile");
      if (profile && profile !== "null") {
        return JSON.parse(profile);
      } else {
        const fetchedProfile = await getProfile(membershipId);
        localStorage.setItem("profile", JSON.stringify(fetchedProfile));
        return fetchedProfile;
      }
    },
    enabled: !!membershipId,
    staleTime: Infinity,
  });
};
