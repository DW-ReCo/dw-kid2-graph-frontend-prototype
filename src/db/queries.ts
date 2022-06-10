import { RxDatabase } from "rxdb";

export const allBlocks = (db: RxDatabase) => db.docs.find().where("document_type").equals("block");
export const allPages = (db: RxDatabase) => db.docs.find().where("document_type").equals("page");
export const allExecutions = (db: RxDatabase) => db.docs.find().where("document_type").equals("execution");
export const allData = (db: RxDatabase) => db.docs.find().where("document_type").equals("data");
