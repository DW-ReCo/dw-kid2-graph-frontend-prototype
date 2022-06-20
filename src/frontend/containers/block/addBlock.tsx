import * as note from "./note";
import * as youtubeLink from "./youtubeLink";
import * as dbTypes from "@db/types";
import {
  // promiseAsHook,
  useObservable,
} from "@frontend/utils";
import React from "react";

const AddBlock = ({ db }: { db: dbTypes.LoadedDb }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const maybeAddNote = useObservable(note.isAvailable(db)) && <button onClick={(_) => note.add(db)}>Add Note</button>;
  const maybeAddYoutube = useObservable(youtubeLink.isAvailable(db)) && (
    <button
      onClick={(_) => {
        console.log("added youtube block");
      }}
    >
      Add Youtube Link
    </button>
  );

  return (
    <div className="block">
      {maybeAddNote}
      {maybeAddYoutube}
    </div>
  );
};

export default AddBlock;
