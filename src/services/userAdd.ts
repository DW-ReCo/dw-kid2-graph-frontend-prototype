// A service for a user, using the frontent, to directly add
//  data to the database.
import { of } from "rxjs";

import * as Types from "@data-types/index";

import * as Queries from "@database/queries";

import { uniqueId } from "@frontend/utils";

import * as Utils from "@utils/index";

// the user adding service takes one argument,
type UserAddService = Types.Service.Generic<[Types.Data.Data], [Types.Data.Data]>;

const execute: Types.Service.ExecuteFunction<[Types.Data.Data], [Types.Data.Data]> = (db, config) => async (data) => {
  // TODO validate data
  const validData = data;

  const started_at = Utils.now();

  await Queries.upsertOne(db, validData);

  const finished_at = Utils.now();

  const newRecord: Types.Record.UserAdded = {
    document__id: uniqueId(),
    document__type: Types.Document.Type.Record,
    record__type: Types.Record.Type.user_added,
    record__started_at: started_at,
    record__finished_at: finished_at,
    record__of_data: [],
    record__to_data: [validData],
  };

  await Queries.upsertOne(db, newRecord);

  return newRecord;
};

const service: UserAddService = {
  // the user adding service is always available
  name: "User Added Service",
  description: "the user may directly add data to the database",
  isAvailable: (..._) => of(true),
  execute,
};

export default service;
