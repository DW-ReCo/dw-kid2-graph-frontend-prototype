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
import { async } from "rxjs";

const log = Logger.makeLogger("db/index");

try {
  // cheap way to make sure we dont add the plugins twice...
  rxdb.addRxPlugin(RxDBDevModePlugin); // FIXME: only when dev enabled

  rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  rxdb.addRxPlugin(RxDBReplicationCouchDBPlugin);
  rxdb.addRxPlugin(RxDBLeaderElectionPlugin);
  rxdb.addRxPlugin(RxDBUpdatePlugin);
  pouchdb.addPouchPlugin(PouchHttp);

  // pouchdb.addPouchPlugin(MemoryAdapter);
  // pouchdb.addPouchPlugin(IdbAdapter);
  pouchdb.addPouchPlugin(MemoryAdapter);
} catch (e) {
  // TODO only do this if "plugin already added" error
  log.error(e);
}

const removeCollection = (name: string, db: rxdb.RxDatabase) =>
  db
    .removeCollection(name)
    .then((_) => console.log(`removed collection ${name}`))
    .catch((e) => console.warn(`removing collection ${name} failed because`, e));

export const removeAllCollections = async (db: rxdb.RxDatabase) => {
  log.debug(`clearing all collections`);
  const collections = Object.keys(db.collections);
  await Promise.all(collections.map((col) => removeCollection(col, db)));
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
  log.debug(`upserting docs`, docs);
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

export const upsertOne = async (db: rxdb.RxDatabase, doc: types.DbDocument): Promise<rxdb.RxDatabase> =>
  upsertDocs(db, [doc]);

const makeDb = async (cfg: cfg.DbConfig) => {
  //  pouchdb.addPouchPlugin(MemoryAdapter);
  return rxdb.createRxDatabase({
    name: cfg.name, // database name
    // storage: pouchdb.getRxStoragePouch("idb"), // RxStorage, idb = IndexedDB, currently waiting for issue #26
    // storage: pouchdb.getRxStoragePouch("memory"), // RxStorage, idb = IndexedDB, currently waiting for issue #26
    storage: getRxStorageMemory(),
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
    eventReduce: true, // <- enable event-reduce to detect changes
  });
};

// TODO!
const initializeLocalDb = async (db: rxdb.RxDatabase, cfg: cfg.LocalDbConfig): Promise<rxdb.RxDatabase> => {
  log.debug(`initializing local db with`, cfg.name);
  return await addCollections(db);
};

const initializeServerDb = async (db: rxdb.RxDatabase, cfg: cfg.ServerDbConfig) => {
  log.debug(`initializing server with`, cfg.name, cfg.location);

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

export const initializeOne = async (dbLoader: cfg.DbConfig): Promise<rxdb.RxDatabase> => {
  // remove any old version od the database
  await rxdb.removeRxDatabase(dbLoader.name, pouchdb.getRxStoragePouch("memory"));

  const db = await makeDb(dbLoader);

  const t = dbLoader._type;

  return t == "local_db_config"
    ? initializeLocalDb(db, dbLoader)
    : t == "server_db_config"
    ? initializeServerDb(db, dbLoader)
    : log.throw(`type ${t} is not a valid database type`);
};

export const initializeAll = async (loaders: cfg.DbConfig[]): Promise<Array<types.LoadedDb>> => {
  return Promise.all(loaders.map((loader) => initializeOne(loader).then((db) => ({ ...loader, db }))));
};
