import { useQuery } from "@tanstack/react-query";
import {
  fetchManifestData,
  getStoredManifestData,
  useManifestStore,
} from "@/lib/fetchManifest";

export const useManifestData = () => {
  const setProgress = useManifestStore((state) => state.setProgress);

  return useQuery({
    queryKey: ["manifestData"],
    queryFn: async () => {
      setProgress(0);
      await fetchManifestData();
      setProgress(100);
      return getStoredManifestData();
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    refetchInterval: 1000 * 60 * 60 * 24 * 7,
  });
};
