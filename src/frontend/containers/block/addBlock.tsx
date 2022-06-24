import * as Note from "./note";
import * as YoutubeLink from "./youtubeLink";
import * as DatabaseTypes from "@data-types/index";
import {
  // promiseAsHook,
  useObservable,
} from "@frontend/utils";
import React from "react";

const AddBlock = (props: { db: DatabaseTypes.LoadedDb; onAdd?: (block: DatabaseTypes.Block) => void }) => {
  const { db, onAdd = (_) => {} } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const maybeAddNote = useObservable(Note.isAvailable(db)) && (
    <button onClick={(_) => Note.add(db).then(onAdd)}>Add Note</button>
  );
  const maybeAddYoutube = useObservable(YoutubeLink.isAvailable(db)) && (
    <button onClick={(_) => YoutubeLink.add(db).then(onAdd)}>Add Youtube Link</button>
  );

  return (
    <div className="app-block">
      {maybeAddNote}
      {maybeAddYoutube}
    </div>
  );
};

export default AddBlock;
