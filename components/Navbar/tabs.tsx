"use client";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function NavbarTabs() {
  const router = useRouter();
  return (
    <Tabs defaultValue="Characters" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="Characters" onClick={() => router.push("/")}>Characters</TabsTrigger>
        <TabsTrigger value="Inventory" onClick={() => router.push("/inventory")}>Inventory</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
