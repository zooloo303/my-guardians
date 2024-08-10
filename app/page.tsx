"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ApiCheck from "@/components/apiCheck";
import { useAuthContext } from "@/components/Auth/AuthContext";
import MyCharacters from "@/components/Character/myCharacters";
import CharacterEquipment from "@/components/Item/characterEquipment";

export default function Home() {
  const router = useRouter();
  const { membershipId } = useAuthContext();

  useEffect(() => {
    if (!membershipId) {
      router.push("/login");
    }
  }, [membershipId, router]);

  if (!membershipId) {
    return null; // or a loading spinner
  }

  return (
    <main className="flex flex-col gap-2 pl-2 pr-2">
      <ApiCheck />
      <MyCharacters />
      <CharacterEquipment showSubclass={true} />
    </main>
  );
}