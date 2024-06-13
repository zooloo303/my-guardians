import Image from "next/image";
import { ScanFace } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authenticateWithBungie } from "@/lib/startAuth";

const AuthorizeMe = () => {
  return (
    <Card className="pl-80 pr-80">
      <CardHeader>
        <h2 className="text-2xl font-bold">We need you to Authorize</h2>
      </CardHeader>
      <CardContent>
        <Button onClick={authenticateWithBungie}>
          <ScanFace className="mr-2 h-4 w-4" />
          Authorize with Bungie
          <Image src="/bungie_logo.png" alt="bungie" width={120} height={120} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthorizeMe;
