// A service for a user, using the frontent, to directly add
//  data to the database.
import { of } from "rxjs";
import * as types from "./types";
import * as utils from "@utils/index";

import * as Db from "@db/types";

import * as queries from "@db/queries";
import { uniqueId } from "@frontend/utils";

// the user adding service takes one argument,
type UserAddService = types.GenericService<[Db.Data], Db.Data>;

const execute: types.ExecuteFunction<[Db.Data], Db.Data> = (db, cfg) => async (data) => {
  // TODO validate data
  const validData = data;

  const started_at = utils.now();

  await queries.upsertOne(db, validData);

  const finished_at = utils.now();

  const newExecution: Db.ExecutionUserAdded = {
    id: uniqueId(),
    document_type: Db.DbDocumentType.Execution,
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
