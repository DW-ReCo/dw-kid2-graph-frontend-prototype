import * as rxdb from "rxdb";

// because we use the PouchDB RxStorage, we have to add the indexeddb adapter first.
//import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
import * as pouchdb from "rxdb/plugins/pouchdb";

import * as MemoryAdapter from "pouchdb-adapter-memory";
import * as IdbAdapter from "pouchdb-adapter-idb";

// import * as aa from 'pouchdb-adapter-idb'

// addRxPlugin(RxDBDevModePlugin);
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

export const initialize = async () => {
  rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  pouchdb.addPouchPlugin(MemoryAdapter);
  pouchdb.addPouchPlugin(IdbAdapter);

  const db = await rxdb.createRxDatabase({
    name: "ourdb", // <- name
    storage: pouchdb.getRxStoragePouch("idb"), // <- RxStorage
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
  });

  const collection = await db.addCollections({
    characters: {
      schema: {
        title: "characters",
        version: 0,
        type: "object",
        primaryKey: "id",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
        },
      },
    },
  });

  return db;
};
