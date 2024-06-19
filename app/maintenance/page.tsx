// maintenance.tsx
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const MaintenancePage = () => {
  return (
    <div className="pt-48 px-40 ">
      <Card>
        <CardHeader>
          <CardTitle>Problems?</CardTitle>
          <CardDescription>
            the api might be down... or something is broken 😥
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            className="w-full h-full rounded-xl"
            src="/SweeperBot.jpg"
            alt="Sweeper Bot"
            width={500}
            height={500}
          />
        </CardContent>
        <CardFooter>
          <p>
            urgent? ... <a href="mailto:zooloo@me.com">Tell me about it</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MaintenancePage;
