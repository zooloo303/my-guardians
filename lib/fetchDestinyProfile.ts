export async function getProfile(membershipId: string) {
  if (!membershipId) throw new Error("No membershipId provided");

  const apiHost = process.env.NEXT_PUBLIC_API_HOST;

  // Check the Destiny 2 API status
  const settingsRes = await fetch("https://www.bungie.net/Platform/Settings/");
  if (!settingsRes.ok) {
    throw new Error("Failed to fetch settings data");
  }
  const settingsData = await settingsRes.json();
  const isDestinyEnabled = settingsData.Response.systems.Destiny2.enabled;

  if (!isDestinyEnabled) {
    throw new Error(
      "Destiny 2 API is currently disabled for maintenance. Please try again later."
    );
  }

  // Fetch the profile data
  const res = await fetch(
    `${apiHost}/api/user/bungie/get/?username=${membershipId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data;
}
