import * as note from "./note";
import * as youtubeLink from "./youtubeLink";
import * as dbTypes from "@db/types";
import {
  // promiseAsHook,
  useObservable,
} from "@frontend/utils";
import React from "react";

const AddBlock = (props: { db: dbTypes.LoadedDb; onAdd?: (block: dbTypes.Block) => void }) => {
  const { db, onAdd = (_) => {} } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const maybeAddNote = useObservable(note.isAvailable(db)) && (
    <button onClick={(_) => note.add(db).then(onAdd)}>Add Note</button>
  );
  const maybeAddYoutube = useObservable(youtubeLink.isAvailable(db)) && (
    <button onClick={(_) => youtubeLink.add(db).then(onAdd)}>Add Youtube Link</button>
  );

  return (
    <div className="block">
      {maybeAddNote}
      {maybeAddYoutube}
    </div>
  );
};

export default AddBlock;
