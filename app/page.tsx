import MyCharacters from "@/components/Character/myCharacters";
import CharacterEquipment from "@/components/Item/characterEquipment";


export default function Home() {
  return (
    <main className="flex flex-col gap-8 p-4">
        <MyCharacters />
        <CharacterEquipment />
    </main>
  );
}
