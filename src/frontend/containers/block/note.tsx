import { upsertOne } from "@db/index";
import * as Queries from "@db/queries";
import * as DatabaseTypes from "@db/types";
import { uniqueId } from "@frontend/utils";

import React from "react";
import {
  Observable,
  of, // concatMap,
  /// delay
} from "rxjs";

export const Component = (props: { db: DatabaseTypes.LoadedDb; block: DatabaseTypes.BlockNote }) => {
  const { db, block } = props;
  const { body } = block;

  const updateText = (text: string) => {
    Queries.mergeBlock(db.instance, { id: block.id, body: text });
  };

  return (
    <textarea onChange={(e) => updateText(e.target.value)} style={{ width: "100%", height: "100px" }}>
      {body}
    </textarea>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const isAvailable = (db: DatabaseTypes.LoadedDb): Promise<boolean> => Promise.resolve(true);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAvailable = (db: DatabaseTypes.LoadedDb): Observable<boolean> => of(true); // .pipe(concatMap((x) => of(x).pipe(delay(1000))));

export const add = async (db: DatabaseTypes.LoadedDb) => {
  console.log("adding note");
  const newNote: DatabaseTypes.BlockNote = {
    id: uniqueId(),
    //@ts-ignore
    document_type: "block",
    type: "note",
  };
  await upsertOne(db.instance, newNote);
  return newNote;
};
