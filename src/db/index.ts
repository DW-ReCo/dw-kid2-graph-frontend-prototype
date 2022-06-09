import * as rxdb from "rxdb";

// because we use the PouchDB RxStorage, we have to add the indexeddb adapter first.
import * as pouchdb from "rxdb/plugins/pouchdb";

import * as MemoryAdapter from "pouchdb-adapter-memory";
import * as IdbAdapter from "pouchdb-adapter-idb";
import * as PouchHttp from "pouchdb-adapter-http";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

import * as cfg from "../cfg";
import * as Logger from "../logger";

import * as schema from "./schema";

const log = Logger.makeLogger("db/index");


const removeCollection = (name: string, db: rxdb.RxDatabase) =>
  db
    .removeCollection(name)
    .then(_ => console.log(`removed collection ${name}`))
    .catch(e => console.warn(`removing collection ${name} failed because`, e))

export const removeAllCollections = async (db: rxdb.RxDatabase) => {
  log.debug(`clearing all collections`);
  const collections = Object.keys(db.collections);
  await Promise.all(collections.map((col) => removeCollection(col, db)));
  console.log(db)
  return db;
};

export const addCollections = async (db: rxdb.RxDatabase) => {
  // create a sample collection
  await removeAllCollections(db);
  log.info("addCollections", schema.collectionSchema);
  await db.addCollections(schema.collectionSchema);
  return db;
};

export const clearDocs = async (db: rxdb.RxDatabase) => {
  await db.docs.find().exec().then((ds) => ds.map(d => d.remove() ));
  console.log("cleared", db)
}


// TODO!
const initializeLocal = async ({ name }: cfg.LocalDbConfig) => {
  rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  rxdb.addRxPlugin(RxDBUpdatePlugin);

  pouchdb.addPouchPlugin(MemoryAdapter);
  pouchdb.addPouchPlugin(IdbAdapter);

  const db = await rxdb.createRxDatabase({
    name, // database name
    storage: pouchdb.getRxStoragePouch("idb"), // RxStorage, idb = IndexedDB
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
    eventReduce: true, // <- enable event-reduce to detect changes
  });
  return await addCollections(db);
};

const initializeServer = async ({ name, location }: cfg.ServerDbConfig) => {
  rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  rxdb.addRxPlugin(RxDBReplicationCouchDBPlugin);
  rxdb.addRxPlugin(RxDBLeaderElectionPlugin);
  rxdb.addRxPlugin(RxDBUpdatePlugin);

  pouchdb.addPouchPlugin(MemoryAdapter);
  pouchdb.addPouchPlugin(PouchHttp);
  pouchdb.addPouchPlugin(IdbAdapter);

  const db = await rxdb.createRxDatabase({
    name, // database name
    storage: pouchdb.getRxStoragePouch("idb"), // RxStorage, idb = IndexedDB
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
    eventReduce: true, // <- enable event-reduce to detect changes
  });

  if (window !== undefined) {
    // add synchronization to all collections
    const syncURL = location;
    Object.values(db.collections)
      .map((col) => col.name)
      .map((colName) =>
        db[colName].syncCouchDB({
          remote: syncURL + colName + "/",
        }),
      );
  }
  return await addCollections(db);
};

export const initialize = async (dbLoader: cfg.DbConfig) => {
  switch (dbLoader._type) {
    case "local_db_config":
      return initializeLocal(dbLoader);
    case "server_db_config":
      return initializeServer(dbLoader);
  }
};
