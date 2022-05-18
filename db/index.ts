import * as rxdb from 'rxdb'

// because we use the PouchDB RxStorage, we have to add the indexeddb adapter first.
//import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
import * as pouchdb from 'rxdb/plugins/pouchdb';

import * as MemoryAdapter from 'pouchdb-adapter-memory';
import * as IdbAdapter from 'pouchdb-adapter-idb';

// import * as aa from 'pouchdb-adapter-idb'

// addRxPlugin(RxDBDevModePlugin);


export const createDb = async () => {

  pouchdb.addPouchPlugin(MemoryAdapter);
  pouchdb.addPouchPlugin(IdbAdapter);

  return rxdb.createRxDatabase({
    name: 'ourdb',                   // <- name
    storage: pouchdb.getRxStoragePouch('idb'),  // <- RxStorage
    cleanupPolicy: {}                   // <- custom cleanup policy (optional)
  });
}

