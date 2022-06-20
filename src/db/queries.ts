import * as types from "./types";
import { RxDatabase, RxQuery } from "rxdb";

export const allBlocks = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("block");

export const allPages = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("page");

export const allExecutions = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("execution");

export const allData = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("data");

export const byId = (db: RxDatabase, id: string): RxQuery => db.docs.findOne().where("id").equals(id);

export const page = byId;

export const data = byId;

export const data = (db: RxDatabase, id: string): RxQuery => db.docs.findOne().where("id").equals(id);

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
export const merge = (db: RxDatabase, id: string, doc: object) =>
  db.docs.findOne().where("id").equals(id).update({ $set: doc });
