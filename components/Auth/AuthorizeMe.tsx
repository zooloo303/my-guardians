import Image from "next/image";
import { ScanFace } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authenticateWithBungie } from "@/lib/startAuth";

const AuthorizeMe = () => {
  return (
    <div className="flex items-start justify-center h-screen">
      <Card className="w-3/4 max-w-3xl mx-auto mt-24">
        <CardHeader className="flex flex-col items-center">
          <Image
            src="/my-guardians.webp"
            alt="my-guardians"
            width={500}
            height={120}
          />
          <h2 className="text-2xl font-bold mt-4">We need you to...</h2>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={authenticateWithBungie}
            className="flex items-center text-lg p-4"
          >
            <ScanFace className="mr-2 h-6 w-6" />
            Authorize with
            <Image
              src="/bungie_logo.png"
              alt="bungie"
              width={50}
              height={50}
              className="ml-2"
            />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorizeMe;
