// A service for a user, using the frontent, to directly add
//  data to the database.
import { of } from "rxjs";
import * as Types from "./types";
import * as Utils from "@utils/index";

import * as Database from "@db/types";

import * as queries from "@db/queries";
import { uniqueId } from "@frontend/utils";

// the user adding service takes one argument,
type UserAddService = Types.GenericService<[Database.Data], Database.Data>;

const execute: Types.ExecuteFunction<[Database.Data], Database.Data> = (db, cfg) => async (data) => {
  // TODO validate data
  const validData = data;

  const started_at = Utils.now();

  await queries.upsertOne(db, validData);

  const finished_at = Utils.now();

  const newExecution: Database.ExecutionUserAdded = {
    id: uniqueId(),
    document_type: Database.DbDocumentType.Execution,
    type: "user_added",
    started_at,
    finished_at,
    of_data: [],
    to_data: [{ data_id: validData.id }],
  };

  await queries.upsertOne(db, newExecution);

  return { record: newExecution, created: validData };
};

const service: UserAddService = {
  // the user adding service is always available
  isAvailable: (..._) => of(true),
  execute,
};

export default service;
