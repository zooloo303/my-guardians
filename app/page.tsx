import MyCharacters from "@/components/Character/myCharacters";
import CharacterEquipment from "@/components/Item/CharacterEquipment";
import InventorySearch from "@/components/Item/InventorySearch";

export default function Home() {
  return (
    <main className="flex flex-col gap-2 p-2">
        <MyCharacters />
        <CharacterEquipment />
        <InventorySearch />
    </main>
  );
}
