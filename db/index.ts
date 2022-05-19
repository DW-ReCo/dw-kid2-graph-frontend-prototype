import * as rxdb from "rxdb";

// because we use the PouchDB RxStorage, we have to add the indexeddb adapter first.
import * as pouchdb from "rxdb/plugins/pouchdb";

import * as MemoryAdapter from "pouchdb-adapter-memory";
import * as IdbAdapter from "pouchdb-adapter-idb";
import * as PouchHttp from "pouchdb-adapter-http";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";

const syncURL = "http://192.168.1.86:10102/";

console.log(syncURL);

import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

export const initialize = async () => {
  rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  rxdb.addRxPlugin(RxDBReplicationCouchDBPlugin);
  rxdb.addRxPlugin(RxDBLeaderElectionPlugin);

  pouchdb.addPouchPlugin(MemoryAdapter);
  pouchdb.addPouchPlugin(PouchHttp);
  pouchdb.addPouchPlugin(IdbAdapter);

  const db = await rxdb.createRxDatabase({
    name: "ourdb", // database name
    storage: pouchdb.getRxStoragePouch("idb"), // RxStorage, idb = IndexedDB
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
    eventReduce: true, // <- enable event-reduce to detect changes
  });

  // create a sample collection
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

  // add synchronization to all collections
  Object.values(db.collections)
    .map((col) => col.name)
    .map((colName) =>
      db[colName].syncCouchDB({
        remote: syncURL + colName + "/",
      }),
    );

  return db;
};
