import { upsertOne } from "@db/index";
import * as dbTypes from "@db/types";
import React from "react";
import {
  Observable,
  of, // concatMap,
  /// delay
} from "rxjs";
import { v4 as uuidv4 } from "uuid";

export const Component = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockNote }) => {
  const { db, block } = props;
  const { body } = block;

  const updateText = (text: string) => {
    // This doesn't work because od all the _rev, _meta info
    //    const newBlock = { ...block, body: text }

    // this does work for a traditional upsert: see issue #41
    const newBlock: dbTypes.BlockNote = {
      body: text,
      // @ts-ignore
      document_type: "block" as dbTypes.DbDocumentType,
      id: block.id,
      state: block.state,
      type: "note",
    };
    upsertOne(db.instance, newBlock);
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
    id: uuidv4(),
    //@ts-ignore
    document_type: "block",
    type: "note",
  };
  await upsertOne(db.instance, newNote);
};
