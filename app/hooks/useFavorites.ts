// hooks/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, setFavorite, unsetFavorite } from '@/lib/api/favoriteApi';
import { useAuthContext } from "@/components/Auth/AuthContext";

export function useFavorites() {
  const { membershipId } = useAuthContext();
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ['favorites', membershipId],
    queryFn: () => membershipId ? getFavorites(membershipId) : Promise.resolve([]),
    enabled: !!membershipId,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: ({ itemInstanceId, itemHash }: { itemInstanceId: string, itemHash: number }) => 
      setFavorite(membershipId!, itemInstanceId, itemHash),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['favorites', membershipId], (oldData: any) => [...oldData, variables]);
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (itemInstanceId: string) => unsetFavorite(membershipId!, itemInstanceId),
    onSuccess: (_, itemInstanceId) => {
      queryClient.setQueryData(['favorites', membershipId], (oldData: any) => 
        oldData.filter((fav: any) => fav.itemInstanceId !== itemInstanceId)
      );
    },
  });

  return {
    favorites: favoritesQuery.data || [],
    isLoading: favoritesQuery.isLoading,
    error: favoritesQuery.error,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
  };
}