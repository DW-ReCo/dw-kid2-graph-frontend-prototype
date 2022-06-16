import React from "react";

import { v4 as uuidv4 } from "uuid";

import { upsertOne } from "../../../db";
import * as dbTypes from "../../../db/types";

export const Component = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockNote }) => {
  const { db, block } = props;
  const { id, body } = block;

  const updateText = (text: string) => {
    // This doesn't work because od all the _rev, _meta info
    //    const newBlock = { ...block, body: text }

    // this does work for a traditional upsert: see issue #41
    const newBlock:dbTypes.BlockNote = {
      body: text,
      // @ts-ignore
      document_type: "block" as dbTypes.DbDocumentType,
      id: block.id,
      state: block.state,
      type: "note",
    };
    upsertOne(db.db, newBlock);
  };

  return (
    <>
      <textarea
        value={body}
        onChange={(e) => updateText(e.target.value)}
        style={{ width: "100%", height: "100px" }}
      />
    </>
  )
  }

export const isAvailable = (db: dbTypes.LoadedDb): Promise<boolean> => Promise.resolve(true);

export const add = async (db: dbTypes.LoadedDb) => {
  console.log("adding note")
  const newNote: dbTypes.BlockNote = {
    id: uuidv4(),
    //@ts-ignore
    document_type: "block",
    type: "note",
  };
  await upsertOne(db.db, newNote);
};
