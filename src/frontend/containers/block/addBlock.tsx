import * as note from "./note";
import * as dbTypes from "@db/types";
import { promiseAsHook } from "@frontend/utils";
import React from "react";

const when = promiseAsHook;

const AddBlock = ({ db }: { db: dbTypes.LoadedDb }) => {
  const maybeAddNote = when(note.isAvailable(db)) && <button onClick={() => note.add(db)}>Add Note</button>;

  return <div className="block">{maybeAddNote}</div>;
};

export default AddBlock;
