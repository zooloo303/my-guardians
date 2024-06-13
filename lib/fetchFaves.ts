import { getUserId } from "@/lib/actions";

export async function getFaves() {
  const username = await getUserId();
  if (!username) return null;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/user/faveItems/get?username=${username}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data;
}
