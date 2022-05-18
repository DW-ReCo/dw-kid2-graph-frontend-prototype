import { createRxDatabase } from 'rxdb';

import { getRxStoragePouch } from 'rxdb/plugins/pouchdb';


export const db = createRxDatabase({
  name: 'heroesdb',
  storage: getRxStoragePouch('idb')
});

