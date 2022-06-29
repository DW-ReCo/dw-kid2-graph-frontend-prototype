import { upsertOne } from "src/database/index";
import * as Queries from "src/database/queries";
import * as DatabaseTypes from "@data-types/index";
import { uniqueId } from "@frontend/utils";

import React from "react";
import {
  Observable,
  of, // concatMap,
  /// delay
} from "rxjs";

export const Component = (props: { db: DatabaseTypes.LoadedDb; block: DatabaseTypes.BlockNote }) => {
  const { db, block } = props;
  const { block__body: body } = block;

  const updateText = (text: string) => {
    Queries.mergeBlock(db.instance, { document__id: block.document__id, block__body: text });
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
    document__id: uniqueId(),
    //@ts-ignore
    document__type: "block",
    block__type: DatabaseTypes.BlockType.note,
  };
  await upsertOne(db.instance, newNote);
  return newNote;
};
