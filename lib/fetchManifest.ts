import Cookies from "js-cookie";
import { create } from "zustand";
import { db, KeyValue } from "../lib/db";
import { ManifestData } from "./interfaces";

interface ManifestStore {
  progress: number;
  setProgress: (progress: number) => void;
}

export const useManifestStore = create<ManifestStore>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
}));

const VERSION_COOKIE_NAME = "manifest_version";
const ENDPOINT = "https://www.bungie.net/Platform/Destiny2/Manifest/";

export async function fetchManifestData() {
  if (typeof window === "undefined") {
    // IndexedDB is only available in the browser
    return;
  }

  const response = await fetch(ENDPOINT);
  const manifestData = await response.json();

  const latestVersion = manifestData.Response.version;
  const storedVersion = Cookies.get(VERSION_COOKIE_NAME);

  // Check if the version has changed
  if (storedVersion === latestVersion) {
    console.log("Manifest is up to date");
    return;
  }

  // Fetch and store new manifest data
  const tables = manifestData.Response.jsonWorldComponentContentPaths.en;

  for (const table in tables) {
    const url = `https://www.bungie.net${tables[table]}`;
    const tableResponse = await fetch(url);
    const tableContent = await tableResponse.json();

    // Store each table content as a key-value pair
    const keyValue: KeyValue = { key: table, value: tableContent };
    await db.keyValuePairs.put(keyValue);
  }
  const { setProgress } = useManifestStore.getState();
  let totalFiles = Object.keys(tables).length;
  let completedFiles = 0;

  for (const table in tables) {
    const url = `https://www.bungie.net${tables[table]}`;
    const tableResponse = await fetch(url);
    const tableContent = await tableResponse.json();

    const keyValue: KeyValue = { key: table, value: tableContent };
    await db.keyValuePairs.put(keyValue);

    completedFiles++;
    setProgress((completedFiles / totalFiles) * 100);
  }

  // Store the new version in cookies
  Cookies.set(VERSION_COOKIE_NAME, latestVersion);

  console.log("Manifest data has been fetched and stored in IndexedDB");
}

export async function getStoredManifestData(): Promise<ManifestData> {
  if (typeof window === "undefined") {
    // IndexedDB is only available in the browser
    return {};
  }

  const allKeys = await db.keyValuePairs.toArray();
  const manifestData: ManifestData = {};
  allKeys.forEach((keyValue) => {
    manifestData[keyValue.key] = keyValue.value;
  });
  return manifestData;
}
