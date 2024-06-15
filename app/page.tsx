import MyCharacters from "@/components/Character/myCharacters";
import ProfileInventory from "@/components/Item/profileInventory";
import CharacterEquipment from "@/components/Item/characterEquipment";
import CharacterInventory from "@/components/Item/characterInventory";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 p-4">
        <MyCharacters />
        <CharacterEquipment />
        <CharacterInventory />
        <ProfileInventory />
    </main>
  );
}
