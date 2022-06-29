import * as Types from "@data-types/index";
import * as Logger from "../logger";
import { RxDatabase, RxQuery } from "rxdb";

const log = Logger.makeLogger("db/queries");

export const allBlocks = (db: RxDatabase): RxQuery => db.docs.find().where("document__type").equals("block");

export const allPages = (db: RxDatabase): RxQuery => db.docs.find().where("document__type").equals("page");

export const allExecutions = (db: RxDatabase): RxQuery => db.docs.find().where("document__type").equals("execution");

export const allData = (db: RxDatabase): RxQuery => db.docs.find().where("document__type").equals("data");

export const byId = (db: RxDatabase, id: string): RxQuery => db.docs.findOne().where("document__id").equals(id);

export const page = byId;

export const data = byId;

export const blocks = (db: RxDatabase, ids: string[]): RxQuery =>
  db.docs.find({
    selector: {
      document__id: {
        $in: ids,
      },
    },
  });

export const pageBlocks = (db: RxDatabase, page: Types.Page) => blocks(db, page.page__blocks);

// takes a database, an id, and a doc like {dataId: id}, which we will set using { $set: doc }, queries for the doc
// and makes the changes
// export const merge = (db: RxDatabase, id: string, doc: Partial<Types.DbDocument>) =>
export const merge = (db: RxDatabase, doc: Partial<Types.Document> & { document__id: Types.DocumentId }) =>
  db.docs.findOne().where("document__id").equals(doc.document__id).update({ $set: doc });

export const mergeBlock = (db: RxDatabase, doc: Partial<Types.Block> & { document__id: Types.DocumentId }) =>
  merge(db, doc);

export const mergePage = (db: RxDatabase, doc: Partial<Types.Page> & { document__id: Types.DocumentId }) =>
  merge(db, doc);

export const remove = (db: RxDatabase, id: Types.DocumentId) =>
  db.docs
    .findOne({
      selector: {
        document__id: { $eq: id },
        document__type: { $in: ["block", "page"] }, // FIXME use type enum
      },
    })
    .remove();

export const upsertDocs = async (db: RxDatabase, docs: Types.Document[]): Promise<RxDatabase> => {
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

export const upsertOne = async (db: RxDatabase, doc: Types.Document): Promise<RxDatabase> => upsertDocs(db, [doc]);
