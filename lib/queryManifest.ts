// queryManifest.ts
import { db } from "@/lib/db";

export async function queryTable(tableName: string): Promise<any> {
  const tableContent = await db.keyValuePairs.get(tableName);

  if (!tableContent) {
    throw new Error("Table not found");
  }

  return tableContent.value;
}

export async function queryTableByHash(
  tableName: string,
  hash: string | number
): Promise<any> {
  const tableContent = await db.keyValuePairs.get(tableName);

  if (!tableContent) {
    throw new Error("Table not found");
  }

  const content = tableContent.value;
  return content[hash];
}
