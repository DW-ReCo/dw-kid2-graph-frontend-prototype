// import * as IdbAdapter from "pouchdb-adapter-idb";
import * as PouchHttp from "pouchdb-adapter-http";
import * as MemoryAdapter from "pouchdb-adapter-memory";
import * as Rxdb from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { getRxStorageMemory } from "rxdb/plugins/memory";
// because we use the PouchDB RxStorage, we have to add the indexeddb adapter first.
import * as Pouchdb from "rxdb/plugins/pouchdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";

import * as Types from "@data-types/index";

import * as Config from "../config";
import * as Logger from "../logger";
import * as Queries from "./queries";
import * as Schema from "./schema";

const log = Logger.makeLogger("db/index");

try {
  // cheap way to make sure we dont add the plugins twice...
  Rxdb.addRxPlugin(RxDBDevModePlugin); // FIXME: only when dev enabled

  Rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  Rxdb.addRxPlugin(RxDBReplicationCouchDBPlugin);
  Rxdb.addRxPlugin(RxDBLeaderElectionPlugin);
  Rxdb.addRxPlugin(RxDBUpdatePlugin);
  Pouchdb.addPouchPlugin(PouchHttp);

  // Pouchdb.addPouchPlugin(MemoryAdapter);
  // Pouchdb.addPouchPlugin(IdbAdapter);
  Pouchdb.addPouchPlugin(MemoryAdapter);
} catch (e) {
  // TODO only do this if "plugin already added" error
  log.error(e);
}

// deprecated, moved namespace
export const upsertOne = Queries.upsertOne;
// deprecated, moved namespace
export const upsertDocs = Queries.upsertDocs;

const removeCollection = (name: string, db: Rxdb.RxDatabase) =>
  db
    .removeCollection(name)
    .then(() => console.log(`removed collection ${name}`))
    .catch((e) => console.warn(`removing collection ${name} failed because`, e));

export const removeAllCollections = async (db: Rxdb.RxDatabase) => {
  log.debug(`clearing all collections`);
  const collections = Object.keys(db.collections);
  await Promise.all(collections.map((col) => removeCollection(col, db)));
  return db;
};

export const addCollections = async (db: Rxdb.RxDatabase) => {
  // create a sample collection
  await removeAllCollections(db);
  log.info("addCollections", Schema.collectionSchema);
  await db.addCollections(Schema.collectionSchema);
  return db;
};

export const clearDocs = async (db: Rxdb.RxDatabase): Promise<Rxdb.RxDatabase> => {
  await db.docs.find().remove();
  return db;
};

const makeDb = async (cfg: Types.DbConfig) => {
  //  Pouchdb.addPouchPlugin(MemoryAdapter);
  return Rxdb.createRxDatabase({
    name: cfg.name, // database name
    // storage: Pouchdb.getRxStoragePouch("idb"), // RxStorage, idb = IndexedDB, currently waiting for issue #26
    // storage: Pouchdb.getRxStoragePouch("memory"), // RxStorage, idb = IndexedDB, currently waiting for issue #26
    storage: getRxStorageMemory(),
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
    eventReduce: true, // <- enable event-reduce to detect changes
  });
};

// TODO!
const initializeLocalDb = async (db: Rxdb.RxDatabase, cfg: Types.LocalDbConfig): Promise<Rxdb.RxDatabase> => {
  log.debug(`initializing local db with`, cfg.name);
  return await addCollections(db);
};

const initializeServerDb = async (db: Rxdb.RxDatabase, cfg: Types.ServerDbConfig) => {
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

export const initializeOne = async (dbLoader: Types.DbConfig): Promise<Types.LoadedDb> => {
  // remove any old version od the database
  await Rxdb.removeRxDatabase(dbLoader.name, Pouchdb.getRxStoragePouch("memory"));

  const db = await makeDb(dbLoader);

  const t = dbLoader._type;

  return t == "local_db_config"
    ? initializeLocalDb(db, dbLoader).then((d) => ({ ...dbLoader, instance: d }))
    : t == "server_db_config"
    ? initializeServerDb(db, dbLoader).then((d) => ({ ...dbLoader, instance: d }))
    : log.throw(`type ${t} is not a valid database type`);
};

export const initializeAll = async (loaders: Types.DbConfig[]): Promise<Array<Types.LoadedDb>> => {
  return Promise.all(loaders.map((loader) => initializeOne(loader)));
};
