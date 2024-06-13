import { useQuery } from "@tanstack/react-query";
import { fetchManifestData, getStoredManifestData } from "@/lib/fetchManifest";

export const useManifestData = () => {
  return useQuery({
    queryKey: ["manifestData"],
    queryFn: async () => {
      await fetchManifestData();
      return getStoredManifestData();
    },
    staleTime: Infinity, // Manifest data doesn't change often
  });
};
