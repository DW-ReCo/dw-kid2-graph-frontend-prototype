import { upsertOne } from "@database/index";
import * as Queries from "@database/queries";
import * as Types from "@data-types/index";
import { uniqueId } from "@frontend/utils";

import React from "react";
import {
  Observable,
  of, // concatMap,
  /// delay
} from "rxjs";

export const Component = (props: { db: Types.Database.LoadedDatabase; block: Types.Block.Note }) => {
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
// export const isAvailable = (db: DatabaseTypes.LoadedDatabase): Promise<boolean> => Promise.resolve(true);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isAvailable = (db: Types.Database.LoadedDatabase): Observable<boolean> => of(true); // .pipe(concatMap((x) => of(x).pipe(delay(1000))));

export const add = async (db: Types.Database.LoadedDatabase) => {
  console.log("adding note");
  const newNote: Types.Block.Note = {
    document__id: uniqueId(),
    //@ts-ignore
    document__type: "block",
    block__type: Types.Block.Type.note,
  };
  await upsertOne(db.instance, newNote);
  return newNote;
};
