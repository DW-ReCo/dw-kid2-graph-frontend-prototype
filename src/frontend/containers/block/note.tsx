import { upsertOne } from "@db/index";
import * as queries from "@db/queries";
import * as dbTypes from "@db/types";
import { uniqueId } from "@frontend/utils";

import React from "react";
import {
  Observable,
  of, // concatMap,
  /// delay
} from "rxjs";

export const Component = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockNote }) => {
  const { db, block } = props;
  const { body } = block;

  const updateText = (text: string) => {
    queries.merge(db.instance, block.id, { body: text });
  };

  return (
    <>
      <textarea value={body} onChange={(e) => updateText(e.target.value)} style={{ width: "100%", height: "100px" }} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const isAvailable = (db: dbTypes.LoadedDb): Promise<boolean> => Promise.resolve(true);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAvailable = (db: dbTypes.LoadedDb): Observable<boolean> => of(true); // .pipe(concatMap((x) => of(x).pipe(delay(1000))));

export const add = async (db: dbTypes.LoadedDb) => {
  console.log("adding note");
  const newNote: dbTypes.BlockNote = {
    id: uniqueId(),
    //@ts-ignore
    document_type: "block",
    type: "note",
  };
  await upsertOne(db.instance, newNote);
  return newNote;
};
