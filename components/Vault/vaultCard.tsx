import { VaultProps } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const VaultCard: React.FC<VaultProps> = ({}) => {
  const { membershipId } = useAuthContext();
  const { data: profileData } = useProfileData(membershipId);

  if (!profileData) {
    return <SkeletonGuy />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-20 h-20 border rounded-xl flex items-center justify-center">
            <Avatar>
              <AvatarImage src={"/vault.svg"} alt={"vault"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </TooltipTrigger>
        <TooltipContent>Vault</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VaultCard;
