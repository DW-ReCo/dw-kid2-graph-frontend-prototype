import * as rxdb from "rxdb";

// because we use the PouchDB RxStorage, we have to add the indexeddb adapter first.
import * as pouchdb from "rxdb/plugins/pouchdb";

import * as MemoryAdapter from "pouchdb-adapter-memory";
import * as IdbAdapter from "pouchdb-adapter-idb";
import * as PouchHttp from "pouchdb-adapter-http";
import { RxDBReplicationCouchDBPlugin } from "rxdb/plugins/replication-couchdb";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import * as Logger from "../logger";

const log = Logger.makeLogger("db/index");

export const testDb = async () => {
  const doc = { id: "hello", document_type: "goodbye" };

  const addDoc = async () =>
    db.docs.atomicUpsert(doc).then((d) => {
      console.log("hello YES succeeded in upserting:", d.get());
    });

  const removeDoc = () =>
    db.docs
      .findOne()
      .where("id")
      .equals("hello")
      .remove()
      .then(() => console.log("hello BYE removed success"))
      .catch((e) => console.error(`hello FAIL removing the doc failed`, e));

  const printDocs = () =>
    db.docs
      .find()
      .exec()
      .then((ds) => Promise.all(ds.map((d) => d.get())))
      .then((ds) => console.log("hello GOT docs", ds));

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
          document_type: { type: "string", maxLength: 100 },
        },
      },
    },
  });

  await addDoc();
  await printDocs();
  await removeDoc();
  await printDocs();
  await addDoc();
  await printDocs();
  await removeDoc();
  await printDocs();
  await addDoc();
  await printDocs();
  await removeDoc();
  await printDocs();
  await addDoc();
  await printDocs();
  await removeDoc();
  await printDocs();
  await addDoc();
  await removeDoc();

  await db.remove();
  console.log(`ended testing db`);
};

console.log("trying testttt");
if (typeof window !== "undefined") {
  console.log("window found");
  testDb();
}
