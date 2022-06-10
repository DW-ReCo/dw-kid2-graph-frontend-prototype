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
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageMemory } from "rxdb/plugins/memory";

import * as cfg from "../cfg";
import * as Logger from "../logger";

import * as schema from "./schema";
import * as types from "./types";

const log = Logger.makeLogger("db/index");

const removeCollection = (name: string, db: rxdb.RxDatabase) =>
  db
    .removeCollection(name)
    .then((_) => console.log(`removed collection ${name}`))
    .catch((e) => console.warn(`removing collection ${name} failed because`, e));

export const removeAllCollections = async (db: rxdb.RxDatabase) => {
  log.debug(`clearing all collections`);
  const collections = Object.keys(db.collections);
  await Promise.all(collections.map((col) => removeCollection(col, db)));
  console.log(db);
  return db;
};

export const addCollections = async (db: rxdb.RxDatabase) => {
  // create a sample collection
  await removeAllCollections(db);
  log.info("addCollections", schema.collectionSchema);
  await db.addCollections(schema.collectionSchema);
  return db;
};

export const clearDocs = async (db: rxdb.RxDatabase): Promise<rxdb.RxDatabase> => {
  await db.docs.find().remove();
  return db;
};

export const upsertDocs = async (db: rxdb.RxDatabase, docs: types.DbDocument[]): Promise<rxdb.RxDatabase> => {
  return await Promise.all(docs.map((d) => db.docs.atomicUpsert(d))).then((ds) => {
    log.info(
      "succeeded in upserting:",
      ds.map((d) => d.get()),
    );
    return db;
  });
  // return await db.docs.bulkUpsert(docs).then(ds => {
  //  log.info("succeeded in upserting:", ds.length);
  //  return db;
  // })
};

// TODO!
const initializeLocal = async ({ name }: cfg.LocalDbConfig) => {
  log.debug(`initializing local db with`, name);
  //  pouchdb.addPouchPlugin(MemoryAdapter);

  const db = await rxdb.createRxDatabase({
    name, // database name
    // storage: pouchdb.getRxStoragePouch("idb"), // RxStorage, idb = IndexedDB
    // storage: pouchdb.getRxStoragePouch("memory"), // RxStorage, idb = IndexedDB
    storage: getRxStorageMemory(),
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
    eventReduce: true, // <- enable event-reduce to detect changes
  });
  return await addCollections(db);
};

const initializeServer = async ({ name, location }: cfg.ServerDbConfig) => {
  log.debug(`initializing server with`, name, location);

  const db = await rxdb.createRxDatabase({
    name, // database name
    // storage: pouchdb.getRxStoragePouch("idb"), // RxStorage, idb = IndexedDB
    // storage: pouchdb.getRxStoragePouch("memory"), // RxStorage, idb = IndexedDB
    storage: getRxStorageMemory(),
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
  rxdb.addRxPlugin(RxDBDevModePlugin); // FIXME: only when dev enabled
  rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  rxdb.addRxPlugin(RxDBReplicationCouchDBPlugin);
  rxdb.addRxPlugin(RxDBLeaderElectionPlugin);
  rxdb.addRxPlugin(RxDBUpdatePlugin);
  pouchdb.addPouchPlugin(PouchHttp);

  //  pouchdb.addPouchPlugin(MemoryAdapter);
  // pouchdb.addPouchPlugin(IdbAdapter);
  pouchdb.addPouchPlugin(MemoryAdapter);

  rxdb.removeRxDatabase(dbLoader.name, pouchdb.getRxStoragePouch("memory"));

  switch (dbLoader._type) {
    case "local_db_config":
      return initializeLocal(dbLoader);
    case "server_db_config":
      return initializeServer(dbLoader);
  }
};
