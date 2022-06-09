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
import {
  executions as testingExecutions,
  pages as testingPages,
  blocks as testingBlocks,
  links as testingLinks,
  data as testingData,
} from "./testing_data";
import { access } from "fs";

const addCollectionByName = async (name: string, db: rxdb.RxDatabase) => {
  return await db.addCollections({
    [name]: { schema: { version: 0, type: "object", primaryKey: "id", properties: { id: { type: "string" } } } },
  });
};

const clearCollection = async (name: string, db: rxdb.RxDatabase) => {
  try {
    return await db.removeCollection(name);
  } catch (e) {
    return Promise.resolve();
  }
};

export const clearAllCollections = async (db: rxdb.RxDatabase) => {
  console.log("clearAllCollections");
  const collections = ["data", "executions", "links", "blocks", "pages"];
  await Promise.all(collections.map((col) => clearCollection(col, db)));
  return db;
};

const addCollections = async (db: rxdb.RxDatabase) => {
  // create a sample collection
  await clearAllCollections(db);
  console.log("addCollections");
  const collections = ["data", "executions", "links", "blocks", "pages"];
  const cls = collections.reduce(
    (acc, name) => ({
      ...acc,
      [name]: { schema: { version: 0, type: "object", primaryKey: "id", properties: { id: { type: "string" } } } },
    }),
    {},
  );
  await db.addCollections(cls);
  return db;
};

export const addTestingData = async (db: rxdb.RxDatabase) => {
  console.log("adding testing data");
  await Promise.all(testingBlocks.map((b, index) => db.blocks.insert(b)));
  await Promise.all(testingExecutions.map((e) => db.executions.insert(e)));
  await Promise.all(testingLinks.map((l) => db.links.insert(l)));
  await Promise.all(testingPages.map((p) => db.pages.insert(p)));
  await Promise.all(testingData.map((d) => db.data.insert(d)));

  return db;
};

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
