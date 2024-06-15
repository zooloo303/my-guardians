import MyCharacters from "@/components/Character/myCharacters";
import CharacterEquipment from "@/components/Item/CharacterEquipment";
import InventorySearch from "@/components/Item/InventorySearch";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 p-4">
        <MyCharacters />
        <CharacterEquipment />
        <InventorySearch />
    </main>
  );
}
