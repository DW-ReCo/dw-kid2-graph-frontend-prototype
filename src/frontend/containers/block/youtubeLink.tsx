// import { upsertOne } from "@db/index";
import * as queries from "@db/queries";
import * as dbTypes from "@db/types";
import React from "react";
import { useRxQuery } from "rxdb-hooks";
import {
  Observable,
  of, // concatMap,
  /// delay
} from "rxjs";

export const Component = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockYoutubeInput }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { db, block } = props;
  const { dataId } = block;

  const dataQuery = useRxQuery(queries.data(db.instance, dataId));
  const data = dataQuery.result && dataQuery.result[0] && dataQuery.result[0].get();

  const youtubeUrl = data?.body;

  return <>{youtubeUrl}</>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAvailable = (db: dbTypes.LoadedDb): Observable<boolean> => of(true); // .pipe(concatMap((x) => of(x).pipe(delay(1000))));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const add = async (db: dbTypes.LoadedDb) => {
  await Promise.resolve(true);
};
