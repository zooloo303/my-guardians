import { VaultProps } from "@/lib/interfaces";
import { SkeletonGuy } from "@/components/skeleton";
import { useProfileData } from "@/app/hooks/useProfileData";
import { useAuthContext } from "@/components/Auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


const VaultCard: React.FC<VaultProps> = ({}) => {
  const { membershipId } = useAuthContext();
  const { data: profileData } = useProfileData(membershipId);

  if (!profileData) {
    return <SkeletonGuy />;
  }

  return (
    <Card                 
        className="w-36 h-36">
      <CardHeader>
      <Avatar>
      <AvatarImage src={'/vault.svg'}
                   alt={"vault"} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <CardTitle>Vault</CardTitle>
    <CardDescription>.../700</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default VaultCard;
