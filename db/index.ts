import { createRxDatabase, addRxPlugin } from 'rxdb';

// because we use the PouchDB RxStorage, we have to add the indexeddb adapter first.
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import * as MemoryAdapter from 'pouchdb-adapter-memory';
import * as IdbAdapter from 'pouchdb-adapter-idb';

// import * as aa from 'pouchdb-adapter-idb'

// addRxPlugin(RxDBDevModePlugin);

addPouchPlugin(MemoryAdapter);
addPouchPlugin(IdbAdapter);

export const db = () => createRxDatabase({
  name: 'ourdb',                   // <- name
  storage: getRxStoragePouch('memory'),  // <- RxStorage
  //  password: 'myPassword',             // <- password (optional)
  // multiInstance: true,                // <- multiInstance (optional, default: true)

  // eventReduce: true,                   // <- eventReduce (optional, default: true)
  cleanupPolicy: {}                   // <- custom cleanup policy (optional)
});

db().then(console.log)
