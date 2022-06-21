import * as types from "./types";
import * as Logger from "../logger";
import { RxDatabase, RxQuery } from "rxdb";

const log = Logger.makeLogger("db/queries");

export const allBlocks = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("block");

export const allPages = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("page");

export const allExecutions = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("execution");

export const allData = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("data");

export const byId = (db: RxDatabase, id: string): RxQuery => db.docs.findOne().where("id").equals(id);

export const page = byId;

export const data = byId;

export const blocks = (db: RxDatabase, ids: string[]): RxQuery =>
  db.docs.find({
    selector: {
      id: {
        $in: ids,
      },
    },
  });

export const pageBlocks = (db: RxDatabase, page: types.Page) => blocks(db, page.blocks);

// takes a database, an id, and a doc like {dataId: id}, which we will set using { $set: doc }, queries for the doc
// and makes the changes
// export const merge = (db: RxDatabase, id: string, doc: Partial<types.DbDocument>) =>
export const merge = (db: RxDatabase, doc: Partial<types.DbDocument> & { id: types.BlockID }) =>
  db.docs.findOne().where("id").equals(doc.id).update({ $set: doc });

export const mergeBlock = (db: RxDatabase, doc: Partial<types.Block> & { id: types.BlockID }) => merge(db, doc);

export const mergePage = (db: RxDatabase, doc: Partial<types.Page> & { id: types.BlockID }) => merge(db, doc);

export const upsertDocs = async (db: RxDatabase, docs: types.DbDocument[]): Promise<RxDatabase> => {
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

export const upsertOne = async (db: RxDatabase, doc: types.DbDocument): Promise<RxDatabase> => upsertDocs(db, [doc]);
