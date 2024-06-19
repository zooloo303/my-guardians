import ApiCheck from "@/components/apiCheck";
import MyCharacters from "@/components/Character/myCharacters";
import CharacterEquipment from "@/components/Item/characterEquipment";
import InventorySearch from "@/components/Item/InventorySearch";

export default function Home() {
  return (
    <main className="flex flex-col gap-2 pl-2 pr-2">
      <ApiCheck />
      <MyCharacters />
      <CharacterEquipment showSubclass={true} />
      <InventorySearch />
    </main>
  );
}
