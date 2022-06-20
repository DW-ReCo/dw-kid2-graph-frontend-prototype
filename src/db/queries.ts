import * as types from "./types";
import { RxDatabase, RxQuery } from "rxdb";

export const allBlocks = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("block");

export const allPages = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("page");

export const allExecutions = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("execution");

export const allData = (db: RxDatabase): RxQuery => db.docs.find().where("document_type").equals("data");

export const page = (db: RxDatabase, id: string): RxQuery => db.docs.findOne().where("id").equals(id);

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
