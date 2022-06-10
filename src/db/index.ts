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
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import {
    getRxStorageMemory
} from 'rxdb/plugins/memory';

import * as cfg from "../cfg";
import * as Logger from "../logger";

import * as schema from "./schema";
import * as types from "./types";

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

export const clearDocs = async (db: rxdb.RxDatabase): Promise<rxdb.RxDatabase> => {
  await db.docs
    .find()
    .exec()
    .then((ds) => Promise.all(ds.map(d => d.remove())))
    // .then((ds) => Promise.all(ds.map(d => d.get())))
    // .then(x => { console.log("hhhhhhhhhhhhhh"); console.log(x); return x; })
    // .then((ds) => ds.map(d => d.id))
    // .then((ids) => {
    //   log.info(`removing ${ids.length} docs`, ids);
    //   return db.docs.bulkRemove(ids);
    // })
    // .then((report) => {
    //   report.success.length && log.info("succeeded in removing:", report.success);
    //   report.error.length && log.warn("failed in removing:", report.error);
    //   return db;
    // })
  return db
}

export const upsertDocs = async (db: rxdb.RxDatabase, docs: types.DbDocument[]): Promise<rxdb.RxDatabase> => {
  return await Promise.all(docs.map(d => db.docs.atomicUpsert(d))).then(ds => {
    log.info("succeeded in upserting:", ds.map(d => d.get()));
    return db;
  })

  return await db.docs.bulkUpsert(docs).then(ds => {
    log.info("succeeded in upserting:", ds.length);
    return db;
  })
}

// TODO!
const initializeLocal = async ({ name }: cfg.LocalDbConfig) => {
  log.debug(`initializing local db with`, name);
  rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  rxdb.addRxPlugin(RxDBUpdatePlugin);

  pouchdb.addPouchPlugin(MemoryAdapter);

  const db = await rxdb.createRxDatabase({
    name, // database name
    storage: pouchdb.getRxStoragePouch("idb"), // RxStorage, idb = IndexedDB
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
    eventReduce: true, // <- enable event-reduce to detect changes
  });
  return await addCollections(db);
};

const initializeServer = async ({ name, location }: cfg.ServerDbConfig) => {
  log.debug(`initializing server with`, name, location);
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
  rxdb.addRxPlugin(RxDBDevModePlugin); // FIXME: only when dev enabled
  pouchdb.addPouchPlugin(IdbAdapter);
  rxdb.removeRxDatabase(dbLoader.name,  pouchdb.getRxStoragePouch("idb"));

  switch (dbLoader._type) {
    case "local_db_config":
      return initializeLocal(dbLoader);
    case "server_db_config":
      return initializeServer(dbLoader);
  }
};

export const testDb = async () => {
  const doc = { id: "hello", document_type: "goodbye" }

  const addDoc = async () => db.docs.atomicUpsert(doc).then(d => {
    console.log("hello YES succeeded in upserting:", d.get());
  })

  const removeDoc = () =>
    db.docs
      .findOne()
      .where("id")
      .equals("hello")
      .remove()
      .then(() => console.log("hello BYE removed success"))
      .catch(e => console.error(`hello FAIL removing the doc failed`, e))

  const printDocs = () =>
    db.docs
      .find()
      .exec()
      .then(ds => Promise.all(ds.map(d => d.get())))
      .then(ds => console.log("hello GOT docs", ds))

  rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  rxdb.addRxPlugin(RxDBReplicationCouchDBPlugin);
  // rxdb.addRxPlugin(RxDBLeaderElectionPlugin);
  // rxdb.addRxPlugin(RxDBUpdatePlugin);

  pouchdb.addPouchPlugin(MemoryAdapter);
  pouchdb.addPouchPlugin(PouchHttp);
  pouchdb.addPouchPlugin(IdbAdapter);

  const db = await rxdb.createRxDatabase({
    // name: "random-test" + Date.now(), // database name
    name: "random-testt", // database name
    // storage: getRxStorageMemory(),
    storage: pouchdb.getRxStoragePouch("memory"), // RxStorage, idb = IndexedDB
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
    eventReduce: true, // <- enable event-reduce to detect changes
  });

  await db.addCollections({
    docs: {
      schema: {
        version: 0,
        type: "object",
        primaryKey: "id",
        properties: {
          id: { type: "string", maxLength: 100 },
          document_type: { type: "string", maxLength: 100 }
        },
      }
    }
  })

  await addDoc()
  await printDocs()
  await removeDoc()
  await printDocs()
  await addDoc()
  await printDocs()
  await removeDoc()
  await printDocs()
  await addDoc()
  await printDocs()
  await removeDoc()
  await printDocs()
  await addDoc()
  await printDocs()
  await removeDoc()
  await printDocs()
  await addDoc()
  await removeDoc()

  await db.remove()
  console.log(`ended testing db`)
};

console.log("trying testttt")
if (typeof window !== "undefined") {
  console.log("window found")
  testDb()
}
