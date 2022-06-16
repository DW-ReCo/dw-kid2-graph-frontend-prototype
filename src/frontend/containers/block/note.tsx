import React from "react";

import { upsertOne } from "../../../db";
import * as dbTypes from "../../../db/types";

const NoteBlock = (props: { db: dbTypes.LoadedDb; block: dbTypes.BlockNote }) => {
  const { db, block } = props;
  const { id, body } = block;

  const updateText = (text: string) => {
    // This doesn't work because od all the _rev, _meta info
    // const newBlock = { ...block, body: text }
    // this does work for a traditional upsert:
    const newBlock = {
      body: text,
      document_type: "block" as dbTypes.DbDocumentType,
      id: block.id,
      state: block.state,
      type: "note",
    };
    // ignore because document_type error above
    // @ts-ignore
    upsertOne(db.db, newBlock)
  };

  return (
    <>
      body
      <textarea
        value={body}
        onChange={(e) => updateText(e.target.value)}
        style={{ width: "100%", height: "100px" }}
      />
    </>
  )
  }

export default NoteBlock;
