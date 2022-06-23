// A service for a user, using the frontent, to directly add
//  data to the database.
import { of } from "rxjs";
import * as Types from "@data-types/index";
import * as Utils from "@utils/index";

import * as Queries from "@db/queries";
import { uniqueId } from "@frontend/utils";

// the user adding service takes one argument,
type UserAddService = Types.GenericService<[Types.Data], Types.Data>;

const execute: Types.ExecuteFunction<[Types.Data], Types.Data> = (db, cfg) => async (data) => {
  // TODO validate data
  const validData = data;

  const started_at = Utils.now();

  await Queries.upsertOne(db, validData);

  const finished_at = Utils.now();

  const newExecution: Types.ExecutionUserAdded = {
    "document/id": uniqueId(),
    "document/type": Types.DocumentType.Execution,
    "execution/type": Types.ExecutionType.user_added,
    "execution/started_at": started_at,
    "execution/finished_at": finished_at,
    "execution/of_data": [],
    "execution/to_data": [{ "document/id": validData["document/id"] }],
  };

  await Queries.upsertOne(db, newExecution);

  return { record: newExecution, created: validData };
};

const service: UserAddService = {
  // the user adding service is always available
  isAvailable: (..._) => of(true),
  execute,
};

export default service;
