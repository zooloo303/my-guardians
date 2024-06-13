import { useQuery } from "@tanstack/react-query";
import { fetchManifestData, getStoredManifestData } from "@/lib/fetchManifest";

export const useManifestData = () => {
  return useQuery({
    queryKey: ["manifestData"],
    queryFn: async () => {
      await fetchManifestData();
      return getStoredManifestData();
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });
};
