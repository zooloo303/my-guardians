// checkApiStatus.ts
export async function isDestinyApiEnabled() {
    try {
      const response = await fetch('https://www.bungie.net/Platform/Settings/');
      if (!response.ok) {
        throw new Error('Failed to fetch settings data');
      }
      const settingsData = await response.json();
      return settingsData.Response.systems.Destiny2.enabled;
    } catch (error) {
      console.error('Error checking API status:', error);
      return true; // Assume the API is enabled if the check fails
    }
  }
  