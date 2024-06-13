import Dexie, { Table } from 'dexie';

export interface KeyValue {
  key: string;
  value: any;
}

export class ManifestDB extends Dexie {
  keyValuePairs!: Table<KeyValue, string>;

  constructor() {
    super('destinyManifest');
    this.version(1).stores({
      keyValuePairs: '&key'
    });
  }
}

export const db = new ManifestDB();
