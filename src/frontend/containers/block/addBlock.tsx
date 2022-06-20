import React from "react";
import * as dbTypes from "@db/types";
import { promiseAsHook } from "@frontend/utils";

import * as note from "./note";

const when = promiseAsHook;

const AddBlock = ({ db }: { db: dbTypes.LoadedDb }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const maybeAddNote = when(note.isAvailable(db)) && <button onClick={(_) => note.add(db)}>Add Note</button>;

  return <div className="block">{maybeAddNote}</div>;
};

export default AddBlock;
