import { toast } from 'sonner';
import { Star } from "lucide-react";
import { FaveProps } from "@/lib/interfaces";
import { Toggle } from "@/components/ui/toggle";
import React, { useState, useCallback, useEffect } from "react";
import { setFavorite, unsetFavorite } from "@/lib/api/favoriteApi";

const Fave: React.FC<FaveProps & { onFavoriteChange: (isFavorite: boolean) => void }> = ({
  username,
  itemInstanceId,
  itemHash,
  initialFavorite,
  onFavoriteChange,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(initialFavorite || false);
  }, [initialFavorite]);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await unsetFavorite(username, itemInstanceId);
        toast.success('Item removed from favorites');
      } else {
        await setFavorite(username, itemInstanceId, itemHash);
        toast.success('Item added to favorites');
      }
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      onFavoriteChange(newFavoriteState);
    } catch (err) {
      console.error(`Failed to ${isFavorite ? "remove favorite" : "set favorite"}`, err);
      toast.error(`Failed to ${isFavorite ? "remove from" : "add to"} favorites`);
    } finally {
      setLoading(false);
    }
  }, [isFavorite, username, itemInstanceId, itemHash, onFavoriteChange]);

  return (
    <Toggle
      variant="outline"
      onPressedChange={handleClick}
      pressed={isFavorite}
      aria-label={isFavorite ? "Unfavorite" : "Favorite"}
      disabled={loading}
      className="h-5 w-5 p-0"
    >
      <Star className={`h-4 w-4 ${isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`} />
    </Toggle>
  );
};

export default React.memo(Fave);