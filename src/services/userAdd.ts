// A service for a user, using the frontent, to directly add
//  data to the database.
import { of } from "rxjs";
import * as Types from "@data-types/index";
import * as Utils from "@utils/index";

import * as Queries from "@db/queries";
import { uniqueId } from "@frontend/utils";

// the user adding service takes one argument,
type UserAddService = Types.GenericService<[Types.Data], [Types.Data]>;

const execute: Types.ExecuteFunction<[Types.Data], [Types.Data]> = (db, cfg) => async (data) => {
  // TODO validate data
  const validData = data;

  const started_at = Utils.now();

  await Queries.upsertOne(db, validData);

  const finished_at = Utils.now();

  const newExecution: Types.ExecutionUserAdded = {
    document__id: uniqueId(),
    document__type: Types.DocumentType.Execution,
    execution__type: Types.ExecutionType.user_added,
    execution__started_at: started_at,
    execution__finished_at: finished_at,
    execution__of_data: [],
    execution__to_data: [validData],
  };

  await Queries.upsertOne(db, newExecution);

  return newExecution;
};

const service: UserAddService = {
  // the user adding service is always available
  isAvailable: (..._) => of(true),
  execute,
};

export default service;
